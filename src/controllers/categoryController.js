import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";



// @desc    Create a new category (Admin only)
// @route   POST /api/v1/category
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description,labal, } = req.body || {};
  const file = req.file?.path;

  // Validation: Check required fields
  if (!name || !description) {
    res.status(400);
    throw new Error("Name and description are required.");
  }

  //  Check if category with the same name already exists
  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    res.status(400);
    throw new Error("Category with this name already exists.");
  }

  // Upload image to Cloudinary if file provided
  let imageUrl = "";
  if (file) {
    try {
      const uploaded = await cloudinary.uploader.upload(file, {
        folder: "dealspot/categories",
        resource_type: "image",
      });
      imageUrl = uploaded.secure_url;
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed. Please try again.");
    }
  }

  //  Create and save new category
  const category = await Category.create({
    name: name,
    description: description,
    image: imageUrl || "",
    labal:labal || ""
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

// @desc    Update a category (Admin only)
// @route   PUT /api/v1/category/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file?.path;

  // Validate ObjectId
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Update fields if provided
  if (name) category.name = name;
  if (description) category.description = description;

  // Upload new image if file provided
  if (file) {
    try {
      const uploaded = await cloudinary.uploader.upload(file, {
        folder: "dealspot/categories",
        resource_type: "image",
      });
      category.image = uploaded.secure_url;
    } catch (error) {
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  // Save updated category
  await category.save();

  res.status(200).json({
    success:true,
    message: "Category updated successfully",
    category,
  });
});

// @desc    Get all categories
// @route   GET /api/v1/category
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  // Fetch all categories from the database
  const categories = await Category.find({});

  // If no categories are found, return 404
  if (!categories || categories.length === 0) {
    res.status(404);
    throw new Error("No categories found");
  }

  // Return categories with count
  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});


// @desc    Get a single category by ID
// @route   GET /api/v1/category/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //  Validate MongoDB ObjectId
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  // Find the category by ID
  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    category,
  });
});


// @desc    Delete a category by ID (Admin only)
// @route   DELETE /api/v1/category/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  // Check if the category exists
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  //  Delete the category
  await category.deleteOne();

  //  Send success response
  res.status(200).json({
    success: true,
    message: `Category '${category.name}' deleted successfully`,
  });
});
