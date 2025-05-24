import { Router } from "express";
import { deleteMySellerAccountController, getSellerProfileController, updateMySellerProfileController } from "../controllers/sellerController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";
import { runValidation, sellerValidateUpdate } from "../middlewares/sellerValidation.js";




const sellerRouter=Router()

// get Profile
// api/v1/seller/profile
sellerRouter.get('/profile',protectRoute,isSellerOrAdmin,getSellerProfileController)

// //update my profile
// api/v1/seller/profile
sellerRouter.put('/',protectRoute,isSellerOrAdmin,sellerValidateUpdate,runValidation,updateMySellerProfileController)

// api/v1/seller/profile
// //delete my account
sellerRouter.delete('/',protectRoute,isSellerOrAdmin,deleteMySellerAccountController)







export default sellerRouter

