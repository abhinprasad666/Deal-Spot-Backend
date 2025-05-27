import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";



// @desc    Create a new category (Admin only)
// @route   POST /api/v1/category
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
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

  // 📦 Create and save new category
  const category = await Category.create({
    name: name,
    description: description,
    image: imageUrl || "",
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});


// @desc    Update existing category (Admin only)
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
export const updateCategory = asyncHandler(async (req, res) => {
  // Find category by ID
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Upload new image to Cloudinary if provided
  const file = req.file?.path;
  let imageUrl = category.image;

  if (file) {
    const uploaded = await cloudinary.uploader.upload(file);
    imageUrl = uploaded.secure_url;
  }

  // Update category fields if provided, else keep old values
  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;
  category.image = imageUrl;

  // Save updated category
  const updated = await category.save();

  // Send response with updated category info
  res.status(200).json({
    success: true,
    message: "Category updated",
    category: updated,
  });
});

// @desc    Delete a category by ID (Admin only)
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  // Find and delete category by ID
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Send success response
  res.status(200).json({
    success: true,
    message: "Category deleted",
  });
});

// @desc    Get all active categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  // Fetch all categories where isActive is true, sorted by newest first
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });

  // Send categories array in response
  res.status(200).json(categories);
});

// @desc    Get a single category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    category,
  });
});
