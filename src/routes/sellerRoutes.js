import { Router } from "express";
import isAuthSeller from "../middlewares/isAuthSeller.js";
import { getSellerProfileController } from "../controllers/sellerController.js";



const sellerRouter=Router()

// get Profile
sellerRouter.get('/profile',isAuthSeller,getSellerProfileController)
// //update my profile
// sellerRouter.put('/',)
// //delete my account
// sellerRouter.delete('/',)







export default sellerRouter

