import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
// import { createProduct, getAllProducts } from "../controllers/productController.js";





const productRouter=Router()

//  productRouter.post('/create',protectRoute,createProduct);
//  productRouter.get('/getAllProduct',protectRoute,getAllProducts);







export default productRouter