import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";
// @desc    Create new order
// @route   POST /api/v1/order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { cartItems, shippingAddress, paymentMethod, amount } = req.body;
    console.log("order iteams", cartItems, shippingAddress, paymentMethod, amount);
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
        totalPrice: amount,
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
});

// @desc    Get logged-in user's orders
// @route   GET /api/v1/order/my-orders
// @access  Private


export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  console.log("userid",userId)

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  const orders = await Order.find({ userId })
    .sort({ orderedAt: -1 })
    .populate({
      path: "cartItems.productId",
      select: "title image price discount", // Select fields you need
    });

  if (!orders || orders.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json({
    success: true,
    orders,
  });
});


// @desc    Get order by ID
// @route   GET /api/v1/order/:id
// @access  Private/Admin


export const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params || {};

    //Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate("userId", "name email");

    // Order not found
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    //  Found and sending order
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

// get all orders


export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("userId", "name email")
    .populate("cartItems.productId", "title image price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

//total revenue
export const getTotalRevenue = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({
    success: true,
    totalRevenue,
  });
});


export const getOrderStatusCounts = asyncHandler(async (req, res) => {
  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const counts = {};
  statusCounts.forEach(item => {
    counts[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    statusCounts: counts,
  });
});