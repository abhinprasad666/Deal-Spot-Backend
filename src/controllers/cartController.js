import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Toggle product in cart (add or remove)
// @route   POST /api/v1/cart/add
// @access  Private

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    // Check if product is already in cart using .equals()
    const existingItemIndex = cart.items.findIndex((item) => item.productId.equals(product._id));

    if (existingItemIndex !== -1) {
        // REMOVE PRODUCT FROM CART
        cart.items.splice(existingItemIndex, 1);

        // Update product's isAddCart field
        product.isAddCart = "Add to Cart";

        await Promise.all([cart.save(), product.save()]);

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart,
        });
    }

    //ADD PRODUCT TO CART
    if (quantity > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} item(s) available in stock`);
    }

    cart.items.push({
        productId: product._id,
        price: product.price,
        quantity,
        discount: product.discount || 0,
        deliveryCharge: product.shippingCharge || 0,
        productName: product.title,
        productImage: product.image,
    });

    product.isAddCart = "Added to Cart";

    await Promise.all([cart.save(), product.save()]);

    res.status(200).json({
        success: true,
        message: "Product added to cart",
        cart,
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params || {};

    // Validate productId format
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    if (!cart.userId.equals(userId)) {
        res.status(403);
        throw new Error("Not authorized to modify this cart");
    }

    const itemExists = cart.items.some((item) => item.productId.toString() === productObjectId.toString());

    if (!itemExists) {
        res.status(404);
        throw new Error("Product not found in cart");
    }

    // Remove item from cart
    cart.items = cart.items.filter((item) => item.productId.toString() !== productObjectId.toString());

    //Update product's isAddCart field to "Add to Cart"
    await Product.findByIdAndUpdate(productObjectId, {
        isAddCart: "Add to Cart",
    });

    // Save updated cart (triggers totals update via pre-save hook)
    await cart.save();

    res.status(200).json({
        message: "Item removed from cart",
        cart,
    });
});

// @desc    Increment quantity of a product in cart
// @route   PUT /api/v1/cart/increment/:productId
// @access  Private
export const incrementCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;
    console.log("product id", productId);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
        res.status(404);
        throw new Error("Product not found in cart");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product does not exist");
    }

    if (item.quantity + 1 > product.stock) {
        res.status(400);
        throw new Error("Cannot exceed available stock");
    }

    item.quantity += 1;

    // Recalculate totals
    cart.totalPrice = cart.calculateTotalPrice();
    cart.totalDiscount = cart.calculateTotalDiscount();
    cart.grandTotal = cart.calculateGrandTotal();

    await cart.save();

    res.status(200).json({
        message: "Product quantity increased",
        cart,
    });
});

// @desc    Decrement quantity of a product in cart
// @route   PUT /api/v1/cart/decrement/:productId
// @access  Private
export const decrementCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
        res.status(404);
        throw new Error("Product not found in cart");
    }

    if (item.quantity <= 1) {
        res.status(400);
        throw new Error("Quantity cannot be less than 1");
    }

    item.quantity -= 1;

    // Recalculate totals
    cart.totalPrice = cart.calculateTotalPrice();
    cart.totalDiscount = cart.calculateTotalDiscount();
    cart.grandTotal = cart.calculateGrandTotal();

    await cart.save();

    res.status(200).json({
        message: "Product quantity decreased",
        cart,
    });
});

// @desc    Get the current user's cart
// @route   GET /api/v1/cart
// @access  Private

export const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId })
        .populate("userId", "name") // populate user name
        .populate("items.productId", "title price stock image"); // populate product name + others

    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    res.status(200).json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    // Loop through each product in the cart
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.productId, {
            isAddCart: "Add to Cart",
        });
    }

    // Clear cart values
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalDiscount = 0;
    cart.grandTotal = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
});
