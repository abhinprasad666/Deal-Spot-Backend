import asyncHandler from "express-async-handler";
import Payment from "../models/PaymentModel.js";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import razorpay from "../config/razorpay.js";

// @desc    Create Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount, cartItems, shippingAddress, paymentMethod } = req.body;
    //  const {userId}=req.user.userId || {}
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Invalid or missing amount");
    }

    // Create order in Razorpay
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create new order entry in MongoDB
    const newOrder = await Order.create({
        userId: "68335e16c807479bb8f196d3",
        // cartItems,
        shippingAddress,
        paymentMethod,
        totalPrice: amount,
        status: "Pending",
        razorpayOrderId: razorpayOrder.id, // Save Razorpay order ID
        orderedAt: new Date(),
    });

    // Send Razorpay order to frontend
    res.status(200).json({
        success: true,
        order: razorpayOrder,
        newOrder,
    });
});

// @desc    Verify Razorpay payment and update DB
// @route   POST /api/v1/payment/verify
// @access  Public
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_SECRET;

    //  Validate signature
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature.",
        });
    }

    //  Get the order from DB using razorpay_order_id (you must have saved it before)
    const orderFromDB = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!orderFromDB) {
        //  Redirect to frontend failure page
        res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
    }

    //  Update Order status
    orderFromDB.status = "Confirmed";
    orderFromDB.paidAt = new Date();
    await orderFromDB.save();

    //  Create a Payment entry in DB
    await Payment.create({
        orderId: orderFromDB._id,
        userId: orderFromDB.userId,
        amount: orderFromDB.totalPrice,
        paymentMethod: "onlinePayment",
        status: "Success",
        transactionId: razorpay_payment_id,
        paymentGateway: "Razorpay",
        paidAt: new Date(),
    });

    //  Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?reference=${razorpay_payment_id}`);
});
