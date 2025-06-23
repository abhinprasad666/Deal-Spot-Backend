import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          if (this.paymentMethod !== "CashOnDelivery" && !v) {
            return false;
          }
          return true;
        },
        message: "Transaction ID is required for online payments",
      },
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
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);

export default Payment
