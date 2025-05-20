import { Router } from "express";
import { runValidation, sellerSignupValidation } from "../middlewares/sellerValidation.js";
import { sellerSingupController } from "../controllers/sellerController.js";
import isAuthRoute from "../middlewares/isAuthRoute.js";
import { isSeller } from "../middlewares/isSeller.js";





const sellerRouter=Router()

sellerRouter .post('/create', sellerSignupValidation,runValidation,isAuthRoute,isSeller, sellerSingupController);
// sellerRouter .post('/seller/login', sellerSignupValidation,runValidation,sellerSingupController);
// sellerRouter .post('/seller/logout',sellerSingupController);




export default sellerRouter