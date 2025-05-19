import { Schema, model } from "mongoose";

// models/Seller.js

const sellerSchema = new Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required."],
            unique: true,
        },
        shopName: {
            type: String,
            required: [true, "Shop name is required."],
            trim: true,
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters."],
            default: "",
        },
        address: {
            type: String,
            required: [true, "Address is required."],
            default: "",
        },
        gstNumber: {
            type: String,
            required: [true, "GST number is required."],
            match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Enter a valid GST number."],
            default: null,
        },
        profileImage: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String, // optional
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
        },
        status: {
            type: String,
            enum: {
                values: ["active", "blocked", "deleted"],
                default: "active",
            },
        },
        statusUpdatedAt: {
            type: Date,
            default: Date.now,
        },
        totalProfit: { type: Number, default: 0 }, // optional
    },
    { timestamps: true }
);

const Seller= model("Seller", sellerSchema);

export default Seller
