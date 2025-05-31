import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique:true
        },
        title: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: 100,
            unique:true
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [2000, "Daescription must not exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Product price is required"],
        },
        offerPrice:{
            type: Number,
            
        },
        // size:{
        //        type: String,
        //     enum: ["S", "M", "L","XL","XXL",""],
        //     default: "",
        // },
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
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type:Schema.Types.ObjectId,
                ref: "Review",
                default:[]
            },
        ],

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = model("Product", productSchema);

export default Product;
