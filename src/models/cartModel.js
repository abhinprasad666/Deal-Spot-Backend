import { Schema, model } from "mongoose";

// Sub-schema for individual cart items
const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  productName: String,  // optional snapshot
  productImage: String, // optional snapshot
});

// Main cart schema
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],

    // Total MRP (without any discounts or delivery charges)
    totalPrice: {
      type: Number,
      default: 0,
    },

    // Total discount amount (quantity * discount)
    totalDiscount: {
      type: Number,
      default: 0,
    },

    // Final price (after discount and delivery charges)
    grandTotal: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Method to calculate total MRP
cartSchema.methods.calculateTotalPrice = function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Method to calculate total discount
cartSchema.methods.calculateTotalDiscount = function () {
  return this.items.reduce((total, item) => {
    return total + (item.discount || 0) * item.quantity;
  }, 0);
};

// Method to calculate grand total
cartSchema.methods.calculateGrandTotal = function () {
  const totalMRP = this.calculateTotalPrice();
  const totalDiscount = this.calculateTotalDiscount();
  const totalDelivery = this.items.reduce((sum, item) => {
    return sum + (item.deliveryCharge || 0) * item.quantity;
  }, 0);
  return totalMRP + totalDelivery - totalDiscount;
};

// Pre-save hook to auto-set prices
cartSchema.pre("save", function (next) {
  this.totalPrice = this.calculateTotalPrice();
  this.totalDiscount = this.calculateTotalDiscount();
  this.grandTotal = this.calculateGrandTotal();
  next();
});

const Cart = model("Cart", cartSchema);
export default Cart;
