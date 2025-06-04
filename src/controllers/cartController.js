import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';





// @desc    Add a product to the cart
// @route   POST /api/v1/cart/add
// @access  Private


export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body || {};
  const userId = req.user.userId;

  console.log("productId:", productId, "quantity:", quantity);

  // Validate input
  if (!productId || !quantity) {
    res.status(400);
    throw new Error("Product ID and valid quantity are required");
  }

  // Fetch product details
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Check if product is already in the cart
  const itemIndex = cart.items.findIndex((item) =>
    item.productId.equals(productId)
  );

  if (itemIndex > -1) {
    // If already in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      productId,
      price: product.price,
      quantity,
      discount: product.discount || 0,
      deliveryCharge: 40, // Flat delivery charge
      productName: product.title,
      productImage: product.image,
    });
  }

  // Save cart (pre-save hook will recalculate totals)
  await cart.save();

  // Populate user name and product name
  const populatedCart = await Cart.findById(cart._id)
    .populate("userId", "name")
    .populate("items.productId", "title");

  res.status(200).json({
    message: "Product added to cart",
    cart: populatedCart,
  });
});


// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId; // Currently logged-in user's ID
  const { productId } = req.params || {};

  // Validate productId format
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  // Convert to ObjectId for safe comparison
  const productObjectId = new mongoose.Types.ObjectId(productId);

  // Find the user's cart
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Ensure this cart belongs to the logged-in user
  if (!cart.userId.equals(userId)) {
    res.status(403);
    throw new Error("Not authorized to modify this cart");
  }

  //  Check if product exists in cart
  const itemExists = cart.items.some(item =>
    item.productId.toString() === productObjectId.toString()
  );
  console.log("Cart Items:", cart.items.map(i => i.productId.toString()));
console.log("Trying to remove:", productObjectId.toString());

console.log("ssssssss",itemExists)
  if (!itemExists) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  // Remove item from cart
  cart.items = cart.items.filter(item =>
    item.productId.toString() !== productObjectId.toString()
  );

  //  Save the updated cart (pre-save hook will auto-update totals)
  await cart.save();

  res.status(200).json({
    message: "Item removed from cart",
    cart,
  });
});



// @desc    Update quantity of product in cart
// @route   PUT /api/v1/cart/update/:productId
// @access  Private
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.find(item => item.productId.equals(productId));
  if (!item) throw new Error('Item not found in cart');

  item.quantity = quantity;
  await cart.save();

  res.status(200).json({ message: 'Quantity updated', cart });
});

// @desc    Get the current user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId }).populate('items.productId', 'name offerPrice thumbnail');

  // Return empty cart if not found
  if (!cart) {
    return res.status(200).json({ cart: { items: [], totalPrice: 0 } });
  }

  res.status(200).json({ cart });
});

// @desc    Clear all items from the cart
// @route   DELETE /api/v1/cart/clear
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.items = [];
  await cart.save();

  res.status(200).json({ message: 'Cart cleared', cart });
});
