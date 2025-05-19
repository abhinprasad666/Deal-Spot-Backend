// models/Product.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, "Please add a review comment"],
            trim: true,
            minlength: [5, "Comment must be at least 5 characters"],
            maxlength: [1000, "Comment must not exceed 1000 characters"],
        },
    },
    { timestamps: true }
);

const Review = model("Review", reviewSchema);

export default Review