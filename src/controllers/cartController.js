import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc    Add a product to the cart
// @route   POST /api/v1/cart/add
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  let cart = await Cart.findOne({ userId });

  // If cart doesn't exist, create one
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

  if (itemIndex > -1) {
    // Product already in cart -> update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // New product -> push to cart
    cart.items.push({
      productId,
      price: product.offerPrice,
      quantity,
      productName: product.name,
      productImage: product.thumbnail,
    });
  }

  await cart.save();
  res.status(200).json({ message: 'Product added to cart', cart });
});

// @desc    Remove product from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(item => !item.productId.equals(productId));

  await cart.save();
  res.status(200).json({ message: 'Item removed from cart', cart });
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
