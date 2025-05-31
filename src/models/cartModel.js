import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    productName: String,  // optional snapshot
    productImage: String, // optional snapshot
});

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

cartSchema.methods.calculateTotalPrice = function () {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

cartSchema.pre('save', function (next) {
    this.totalPrice = this.calculateTotalPrice();
    next();
});

const Cart = model("Cart", cartSchema);
export default Cart;
