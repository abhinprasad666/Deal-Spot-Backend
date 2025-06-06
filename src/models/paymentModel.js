import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order", // Link to order
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Who paid
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["onlinePayment", "CashOnDelivery"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed", "Refunded"],
    default: "Pending",
  },
  transactionId: {
    type: String,
    required: function () {
      return this.paymentMethod !== "CashOnDelivery"; // Only for online
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
