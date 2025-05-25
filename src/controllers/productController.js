import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js"; // Assuming admin is in User model

// @desc    Create a new product (Admin or Verified Seller)
// @route   POST /api/v1/products
// @access  Private (Seller or Admin)
export const createProduct = asyncHandler(async (req, res) => {
    const existUser = req.user;

    // Check if role is seller
    if (existUser.role === "seller") {
        const user = await Seller.findById(existUser.userId);

        if (!user || !user.isVerified) {
            res.status(403);
            throw new Error("Seller not found or not verified.");
        }
    }
    // Check if role is admin
    else if (existUser.role === "admin") {
        const user = await User.findById(existUser.userId);

        if (!user) {
            res.status(403);
            throw new Error("Admin user not found.");
        }
    }
    // If neither seller nor admin
    else {
        res.status(403);
        throw new Error("Access denied. Only sellers or admins can create products.");
    }

    const {
        name,
        description,
        price,
        image,
        category,
        brand,
        countInStock,
        isFeatured,
    } = req.body;

    // Create product
    const product = await Product.create({
        seller: user.role === "seller" ? user._id : null, // if admin, seller is null
        name,
        description,
        price,
        image,
        category,
        brand,
        countInStock,
        isFeatured,
    });

    res.status(201).json({
        message: "Product created successfully",
        product,
    });
});
