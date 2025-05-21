import { Router } from "express";
import { isSeller } from "../middlewares/isSeller.js";
import isAuthRoute from "../middlewares/isAuthRoute.js";
import { createProduct, getAllProducts } from "../controllers/productController.js";





const productRouter=Router()

 productRouter.post('/create',isAuthRoute,isSeller,createProduct);
 productRouter.get('/getAllProduct',isAuthRoute,isSeller,getAllProducts)







export default productRouter