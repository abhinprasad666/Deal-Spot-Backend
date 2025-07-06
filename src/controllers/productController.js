import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";

// @desc    Create a new product (Only Admin or Verified Seller)
// @route   POST /api/v1/products
// @access  Private (Seller or Admin)
export const createProduct = asyncHandler(async (req, res) => {
    const currentUser = req.user;

    // Check if user is authenticated
    if (!currentUser) {
        res.status(401);
        throw new Error("Unauthorized. Please log in to access this resource.");
    }
    //  Check if user exists
    const existUser = await User.findOne({ _id: currentUser.userId });

    if (!existUser) {
        res.status(404);
        throw new Error("User not found");
    }

    // Allow only seller or admin to create products
    if (currentUser.role !== "seller" && currentUser.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Only sellers or admins can create products.");
    }

    // If the user is a seller, check if seller exists and is verified
    if (currentUser.role === "seller") {
        const seller = await Seller.findOne({ userId: currentUser.userId });
        if (!seller) {
            res.status(404);
            throw new Error("Seller account not found.");
        }
        if (!seller.isVerified) {
            res.status(403);
            throw new Error("Seller account is not verified. Please wait for verification.");
        }
    }

    // Check if image file is provided in the request
    const file = req.file?.path;
    if (!file) {
        res.status(400);
        throw new Error("Image file is required");
    }

    // Destructure product fields from request body
    const { title, description, price, category, brand, stock, isFeatured, offerPrice, discount } = req.body;

    // Validate category ID presence and format
    if (!category && !mongoose.isValidObjectId(category)) {
        res.status(400);
        throw new Error("Invalid category ID");
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = "";
    if (file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file, {
                folder: "dealspot/products",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    // Check if the provided category exists in DB
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(404);
        throw new Error("Category not found");
    }

    // Create the product document in the database
    const product = await Product.create({
        seller: existUser._id,
        title,
        description,
        price,
        image: imageUrl,
        category,
        brand,
        stock,
        isFeatured,
        offerPrice: offerPrice || 0,
        discount: discount || 0,
    });

    // Now populate both fields
    await product.populate([
        { path: "category", select: "name description image" },
        { path: "seller", select: "name" },
    ]);

    // Send success response with created product including populated category info
    res.status(201).json({
        message: "Product created successfully",
        product,
    });
});

// @desc    Update a product (Only Admin or Verified Seller who owns the product)
// @route   PUT /api/v1/products/:id
// @access  Private (Seller or Admin)
export const updateProduct = asyncHandler(async (req, res) => {
    const currentUser = req.user;

    // Destructure updated fields from request body
    const { title, description, price, category, brand, stock, isFeatured, offerPrice } = req.body ||{};

    // Check authentication
    if (!currentUser) {
        res.status(401);
        throw new Error("Unauthorized. Please log in.");
    }

    // Allow only seller or admin
    if (currentUser.role !== "seller" && currentUser.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Only sellers or admins can update products.");
    }

    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }

    // If user is seller, verify ownership of the product
    if (currentUser.role === "seller" && product.seller.toString() !== currentUser.userId) {
        res.status(403);
        throw new Error("You can only update your own products.");
    }
    // Validate category ID if category is provided
    if (category) {
        if (!mongoose.isValidObjectId(category)) {
            res.status(400);
            throw new Error("Invalid category ID");
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(404);
            throw new Error("Category not found");
        }

        // Assign category only if valid
        product.category = category;
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = product.image;
    if (req.file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file.path, {
                folder: "dealspot/product",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    // Update other fields if provided or keep existing
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;
    product.product = offerPrice || product.offerPrice;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.offerPrice = offerPrice || product.offerPrice;
    product.image = imageUrl;

    // Save updated product
    const updatedProduct = await product.save();

    // Now populate both fields
    await product.populate([
        { path: "category", select: "name description image" },
        { path: "seller", select: "name" },
    ]);

    // Send success response with updated product including category info
    res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
    });
});

// @desc    Get all products (Admin or public)
// @route   GET /api/v1/products
// @access  Public

export const getAllProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword;

    const searchStage = keyword
        ? {
              $match: {
                  $or: [
                      { title: { $regex: keyword, $options: "i" } },
                      { brand: { $regex: keyword, $options: "i" } },
                      { "category.name": { $regex: keyword, $options: "i" } },
                  ],
              },
          }
        : { $match: {} };

    const products = await Product.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },
        searchStage
    ]);

    res.status(200).json({
        success: true,
        message: "All Products",
        count: products.length,
        products,
    });
});


// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
export const getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(id).populate([
        { path: "category", select: "name description image" },
        { path: "seller", select: "name" },
    ]);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const featuredProducts = await Product.find({ isFeatured: true }).populate([
        { path: "category", select: "name description image" },
        { path: "seller", select: "name" },
    ]);

    if (!featuredProducts || featuredProducts.length === 0) {
        res.status(404);
        throw new Error("No featured products found");
    }

    res.status(200).json({
        success: true,
        featuredProducts,
    });
});

// @desc    Get products created by the logged-in seller
// @route   GET /api/v1/products/my
// @access  Private (Seller only)
export const getMyProducts = asyncHandler(async (req, res) => {
    const currentUser = req.user;
    console.log("current user role",currentUser)

    // Check if current user exists and is a seller
   if (!currentUser || (currentUser.role !== "seller" && currentUser.role !== "admin")) {
    res.status(403);
    throw new Error("Only sellers can access this resource");
}


    // Find all products created by this seller
    const products = await Product.find({ seller: currentUser.userId }).populate([
        { path: "category", select: "name description image" },
        { path: "seller", select: "name" },
    ]);

    // If no products are found, return 404
    if (!products || products.length === 0) {
        res.status(404);
        throw new Error("No products found for this seller");
    }

    // Return the seller's products
    res.status(200).json({
        success: true,
        products,
    });
});

// @desc    Delete a product (Only Admin or Seller who owns it)
// @route   DELETE /api/v1/products/:id
// @access  Private (Seller or Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;

    // Validate product ID format
    if (!mongoose.isValidObjectId(id)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Check if the user is allowed to delete this product
    if (currentUser.role === "seller" && product.seller.toString() !== currentUser.userId) {
        res.status(403);
        throw new Error("You can only delete your own products");
    }

    //  Store product name before deletion
    const deletedProductName = product.title;

    //  Delete the product
    await product.deleteOne();

    //  Send response with only product name
    res.status(200).json({
        message: "Product deleted successfully",
        deletedProduct: deletedProductName,
    });
});
