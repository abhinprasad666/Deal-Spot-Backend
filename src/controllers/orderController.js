import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

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
    const orders = await Order.find({ userId: req.user.userId }).sort({ orderedAt: -1 }).populate({
        path: "cartItems.productId",
        select: "title image price discount", // Add other fields as needed
    });

    //  If no orders placed yet
    if (!orders || orders.length === 0) {
        return res.status(200).json([]); // Send empty array to keep frontend consistent
    }

    //  Orders found
    res.status(200).json({ success: true, orders });
});

// @desc    Get order by ID
// @route   GET /api/v1/order/:id
// @access  Private/Admin
import mongoose from "mongoose";

export const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

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
