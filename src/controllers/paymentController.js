import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import razorpay from "../config/razorpay.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Payment from "../models/paymentModel.js";




// @desc    Create Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private
// @desc    Create Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private

export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const { amount,totalDiscount, shippingAddress, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Invalid or missing amount");
    }

    if (!shippingAddress || !paymentMethod) {
        res.status(400);
        throw new Error("Shipping address and payment method are required");
    }

    // Fetch the user's cart
    const userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart || userCart.items.length === 0) {
        res.status(400);
        throw new Error("Cart is empty");
    }

    // Map cart items to Order format
    const cartItems = userCart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        // subtotal: item.subtotal,
    }));

    // Create Razorpay order
    const options = {
        amount: amount * 100, // amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create Order in MongoDB
    const newOrder = await Order.create({
        userId,
        cartItems,
        shippingAddress,
        paymentMethod,
        totalPrice: amount,
        totalDiscount:totalDiscount,
        status: "Pending",
        razorpayOrderId: razorpayOrder.id,
        orderedAt: new Date(),
        statusHistory: [
            {
                status: "Pending",
                changedAt: new Date(),
            },
        ],
    });

    // Send Razorpay order + Order data to frontend
    res.status(200).json({
        success: true,
        order: razorpayOrder,
        newOrder,
    });
});

// @desc    Verify Razorpay payment and update DB
// @route   POST /api/v1/payment/verify
// @access  Public

// Razorpay Payment Verification and Order Confirmation
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.userId;

    const secret = process.env.RAZORPAY_SECRET;

    // Step 1: Razorpay signature verify cheyyuka
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            error: "Invalid payment signature.",
        });
    }

    // Step 2: Order DB-lyil ninnum fetch cheyyuka
    const orderFromDB = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!orderFromDB) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
    }

    // Step 3: Order status "Confirmed" aayi set cheyyuka
    orderFromDB.status = "Confirmed";
    orderFromDB.paidAt = new Date();
    await orderFromDB.save();

    // Step 4: Payment record DB-il create cheyyuka
    await Payment.create({
        orderId: orderFromDB._id,
        userId: orderFromDB.userId,
        amount: orderFromDB.totalPrice,
        paymentMethod: orderFromDB.paymentMethod,
        status: "Success",
        transactionId: razorpay_payment_id,
        paymentGateway: "Razorpay",
        paidAt: new Date(),
    });

    // Step 5: Product stock kurakkanam & isAddCart field reset cheyyanam
    const updatePromises = orderFromDB.cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
            // 🔸 Stock kurakkanam
            if (product.stock < item.quantity) {
                console.warn(` Stock not enough for: ${product.title}`);
            } else {
                product.stock -= item.quantity;
            }

            //isAddCart back to "Add to Cart" (default state)
            product.isAddCart = "Add to Cart";

            await product.save();
        }
    });

    await Promise.all(updatePromises);

    // Step 6: User cart clean cheyyuka
    await Cart.deleteOne({ userId });

    // Step 7: Success page-lek redirect cheyyuka
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?reference=${razorpay_payment_id}`);
});