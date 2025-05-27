import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            minlength: [3, "Category name must be at least 3 characters"],
            maxlength: [50, "Category name must not exceed 50 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description must not exceed 500 characters"],
        },
        image: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Category = model("Category", categorySchema);

export default Category;
