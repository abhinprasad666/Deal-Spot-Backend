import { Schema,model } from "mongoose";

const mongoose = require('mongoose');

// Sub-schema for order items
const orderItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product collection
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User collection
    required: true,
  },

  // List of ordered items
  items: [orderItemSchema],

  // Shipping details
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },

  // Payment type
  paymentMethod: {
    type: String,
    enum: ['CashOnDelivery', 'Card', 'UPI'],
    default: 'CashOnDelivery',
  },

  // Total price of the order
  totalPrice: {
    type: Number,
    required: true,
  },

  // Order status for full lifecycle
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending', // Initial status
  },

  // Optional: History of status changes (for admin panel / tracking)
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Time when order was placed
  orderedAt: {
    type: Date,
    default: Date.now,
  },

  // If paid, when
  paidAt: {
    type: Date,
  },

  // If delivered, when
  deliveredAt: {
    type: Date,
  },
});

const Order = model("Order", orderSchema);

export default Order

