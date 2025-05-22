import { Router } from "express";
import isAuthSeller from "../middlewares/isAuthSeller.js";
import { deleteMySellerAccountController, getSellerProfileController, updateMySellerProfileController } from "../controllers/sellerController.js";



const sellerRouter=Router()

// get Profile
sellerRouter.get('/profile',isAuthSeller,getSellerProfileController)
// //update my profile
sellerRouter.put('/',isAuthSeller,updateMySellerProfileController)
// //delete my account
sellerRouter.delete('/',isAuthSeller,deleteMySellerAccountController)







export default sellerRouter

