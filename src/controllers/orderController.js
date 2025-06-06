import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";



// @desc    Create new order
// @route   POST /api/v1/order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { cartItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  // Validate input
  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const order = new Order({
    userId: req.user.userId,
    cartItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json({ success: true, order: createdOrder });
});

// @desc    Get logged-in user's orders
// @route   GET /api/v1/order/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ orderedAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc    Get order by ID
// @route   GET /api/v1/order/:id
// @access  Private/Admin
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("userId", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ success: true, order });
});

// @desc    Update order status (admin only)
// @route   PUT /api/v1/order/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  order.statusHistory.push({ status });

  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();
  res.status(200).json({ success: true, order: updatedOrder });
});
