import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";






const categoryRouter=Router()


// @route   POST /api/v1/categories
// @desc    Create new category (Admin only)
// @access  Private (Admin)
categoryRouter.post("/", protectRoute, isAdmin, upload.single("image"), createCategory);

// @route   PUT /api/v1/categories/:id
// @desc    Update existing category (Admin only)
// @access  Private (Admin)
categoryRouter.put("/:id", protectRoute, isAdmin, upload.single("image"), updateCategory);

// @route   DELETE /api/v1/categories/:id
// @desc    Delete a category by ID (Admin only)
// @access  Private (Admin)
categoryRouter.delete("/:id", protectRoute, isAdmin, deleteCategory);

// @route   GET /api/v1/categories
// @desc    Get all active categories (Public)
// @access  Public
categoryRouter.get("/", getAllCategories);

// @route   GET /api/v1/categories/:id
// @desc    Get single category by ID
// @access  Public
categoryRouter.get("/:id", getCategoryById);










export default categoryRouter