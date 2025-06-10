import { Schema, model } from "mongoose";
import Review from "./reviewModel.js"; // Import Review model

const productSchema = new Schema(
    {
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: 100,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [2000, "Description must not exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Product price is required"],
        },
        discount: {
            type: Number,
            default: 0,
        },
         shippingCharge: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            default: "",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        brand: {
            type: String,
            trim: true,
            default: "Unbrand",
        },
        stock: {
            type: Number,
            required: true,
            min: 1,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
                default: [],
            },
        ],
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Add static method to update rating and numOfReviews
productSchema.statics.updateRating = async function (productId) {
    const reviews = await Review.find({ product: productId });

    const numOfReviews = reviews.length;

    const avgRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) / numOfReviews || 0;

    await this.findByIdAndUpdate(productId, {
        numOfReviews,
        rating: avgRating.toFixed(1),
    });
};

const Product = model("Product", productSchema);

export default Product;
