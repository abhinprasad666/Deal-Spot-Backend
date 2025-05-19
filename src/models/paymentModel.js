import { Schema } from "mongoose";

const paymentSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Link to the corresponding order
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Who made the payment
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    paymentMethod: {
        type: String,
        enum: ["Card", "UPI", "NetBanking", "CashOnDelivery"],
        required: true,
    },

    status: {
        type: String,
        enum: ["Pending", "Success", "Failed", "Refunded"],
        default: "Pending", // Initial state
    },

    transactionId: {
        type: String,
        required: function () {
            return this.paymentMethod !== "CashOnDelivery";
        },
        trim: true,
        unique: true,
    },

    paymentGateway: {
        type: String,
        enum: ["Razorpay", "Stripe", "PayPal", "Manual"],
        default: "Manual",
    },

    paidAt: {
        type: Date,
        default: Date.now,
    },
});

const Payment = model("Payment", paymentSchema);

export default Payment;
