import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getMyProducts, getSingleProduct, updateProduct } from "../controllers/productController.js";
import { runValidation, validateCreateProduct } from "../middlewares/validationMiddlewares/productValidation.js";
import { upload } from "../middlewares/multer.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";

const productRouter=Router()

// @desc    Create a new product (Only Admin or Verified Seller)
// @route   POST /api/v1/products
// @access  Private (Seller or Admin)
productRouter.post('/',protectRoute,isSellerOrAdmin,upload.single("image"),validateCreateProduct,runValidation,createProduct);

// @desc    Update a product (Only Admin or Verified Seller who owns the product)
// @route   PUT /api/v1/products/:id
// @access  Private (Seller or Admin)
productRouter.put('/:id',protectRoute,isSellerOrAdmin,upload.single("image"),updateProduct);

// @desc    Get all products (Admin or public)
// @route   GET /api/v1/products
// @access  Public
productRouter.get('/',protectRoute,getAllProducts);

// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
productRouter.get('/single/:id',protectRoute,getSingleProduct);

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
productRouter.get('/featured',protectRoute,getFeaturedProducts);

// @desc    Get products created by the logged-in seller
// @route   GET /api/v1/products/my
// @access  Private (Seller only)
productRouter.get('/my',protectRoute,getMyProducts);

// @desc    Delete a product (Only Admin or Seller who owns it)
// @route   DELETE /api/v1/products/:id
// @access  Private (Seller or Admin)
productRouter.delete('/:id',protectRoute,deleteProduct);







export default productRouter