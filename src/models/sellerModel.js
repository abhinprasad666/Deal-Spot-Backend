import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// models/Seller.js

const sellerSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // each user can have only one seller profile
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
            
        },
        gstNumber: {
            type: String,
            // required: [true, "GST number is required."],
            // match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Enter a valid GST number."],
            default: null,
        },
        profileImage: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "blocked", "deleted"],
            default: "active",
        },
        statusUpdatedAt: {
            type: Date,
            default: Date.now,
        },
        totalProfit: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// password hash before saving
sellerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// password compare method
sellerSchema.methods.checkPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
};

const Seller = model("Seller", sellerSchema);

export default Seller;
