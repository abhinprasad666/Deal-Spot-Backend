import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// 1. Create product
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, image, category, brand, countInStock, isFeatured } = req.body || {};

    if (!name || !description || !price) {
        res.status(400);
        throw new Error("Please provide name, description and price");
    }

    const product = new Product({
        seller: req.currentUser.userId, // seller id from logged in user
        name,
        description,
        price,
        image: image || "",
        category,
        brand: brand,
        countInStock: countInStock || 0,
        isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// 2. Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate({
      path: 'seller',
      model: 'Seller',
      populate: {
        path: 'seller', // This is Seller → User
        model: 'User',
        select: 'name',
      },
    });

  if (!products || products.length === 0) {
    res.status(404);
    throw new Error('No products found');
  }

  res.json({
    success: true,
    message: 'All products',
    products,
  });
});

