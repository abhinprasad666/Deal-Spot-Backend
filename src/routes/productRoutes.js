import { Router } from "express";
import { isAuthSeller } from "../middlewares/isAuthSeller.js";
import isAuthRoute from "../middlewares/isAuthUser.js";
import { createProduct, getAllProducts } from "../controllers/productController.js";





const productRouter=Router()

 productRouter.post('/create',isAuthRoute,isAuthSeller,createProduct);
 productRouter.get('/getAllProduct',isAuthRoute,isAuthSeller,getAllProducts);







export default productRouter