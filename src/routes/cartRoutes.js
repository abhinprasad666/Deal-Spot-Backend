import { Router } from "express";
import {
  addToCart,
  removeFromCart,
  getUserCart,
  clearCart,
  incrementCartItem,
  decrementCartItem,
} from '../controllers/cartController.js';
const cartRouter=Router()
import { protectRoute } from "../middlewares/protectRoute.js";



// @route   POST /api/v1/cart/add
// @desc    Add a product to the cart
// @access  Private
cartRouter.post('/add',protectRoute , addToCart);

// @route   DELETE /api/v1/cart/remove/:productId
// @desc    Remove a product from the cart
// @access  Private
cartRouter.delete('/delete/:productId',  protectRoute , removeFromCart);

// @desc    Increment quantity of a product in cart
// @route   PUT /api/v1/cart/increment/:productId
// @access  Private
cartRouter.put("/increment/:productId", protectRoute, incrementCartItem);

// @desc    Decrement quantity of a product in cart
// @route   PUT /api/v1/cart/decrement/:productId
// @access  Private
cartRouter.put("/decrement/:productId", protectRoute, decrementCartItem);


// @route   GET /api/v1/cart
// @desc    Get current user's cart
// @access  Private
cartRouter.get('/',protectRoute , getUserCart);

// @route   DELETE /api/v1/cart/clear
// @desc    Clear entire cart
// @access  Private
cartRouter.delete('/clear',  protectRoute , clearCart);


export default cartRouter