import { Schema, model } from "mongoose";

// Sub-schema for order items
const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

// Main Order Schema
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    cartItems: [orderItemSchema],

    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
    },

    paymentMethod: {
        type: String,
        enum: ["CashOnDelivery", "onlinePayment"],
        default: "CashOnDelivery",
    },

    totalPrice: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Refunded"],
        default: "Pending",
    },

    statusHistory: [
        {
            status: {
                type: String,
                enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Refunded"],
            },
            changedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    orderedAt: {
        type: Date,
        default: Date.now,
    },

    paidAt: {
        type: Date,
    },

    deliveredAt: {
        type: Date,
    },

    // Razorpay order ID to map backend <--> Razorpay order
    razorpayOrderId: {
        type: String,
        trim: true,
    },
});

const Order = model("Order", orderSchema);
export default Order;
