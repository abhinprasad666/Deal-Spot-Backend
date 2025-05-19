import { Schema ,model} from "mongoose";

// Sub-schema for items
const cartItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
});

// Main Cart schema
const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema], // using sub-schema here
    totalPrice: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
// Exporting the Cart model
const Cart= model("Cart", cartSchema);

export default Cart
