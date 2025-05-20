import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// 1. Create product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, brand, countInStock, isFeatured } = req.body;
  
  if (!name || !description || !price) {
    res.status(400);
    throw new Error('Please provide name, description and price');
  }

  const product = new Product({
    seller: req.user._id,  // seller id from logged in user
    name,
    description,
    price,
    image: image || "",
    category,
    brand: brand || "Unbrand",
    countInStock: countInStock || 0,
    isFeatured: isFeatured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});