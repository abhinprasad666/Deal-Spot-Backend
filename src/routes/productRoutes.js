import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createProduct } from "../controllers/productController.js";
import { runValidation, validateCreateProduct } from "../middlewares/validationMiddlewares/productValidation.js";
import { upload } from "../middlewares/multer.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";






const productRouter=Router()

// @desc    Create a new product (Only Admin or Verified Seller)
// @route   POST /api/v1/products
productRouter.post('/',protectRoute,isSellerOrAdmin,upload.single("image"),validateCreateProduct,runValidation,createProduct);

//  //update product
// productRouter.post('/',protectRoute,createProduct);

// // Get Seller's Own Products
// productRouter.post('/',protectRoute,createProduct);

//   // delete Product
// productRouter.post('/',protectRoute,createProduct);

//  //get all product
// productRouter.get('/',protectRoute,createProduct);

// //get single product
// productRouter.post('/',protectRoute,createProduct);

// //Get Featured Products
// productRouter.post('/',protectRoute,createProduct);





export default productRouter