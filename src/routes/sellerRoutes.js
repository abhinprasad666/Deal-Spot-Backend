import { Router } from "express";
import { deleteMySellerAccountController, getSellerProfileController, registerController, updateMySellerProfileController } from "../controllers/sellerController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";
import { runValidation, sellerRegisterValidation, sellerValidateUpdate } from "../middlewares/validationMiddlewares/sellerValidation.js";





const sellerRouter=Router()


//register
//api/v1/seller
sellerRouter.post('/',protectRoute,sellerRegisterValidation,runValidation,registerController)

// get Profile
// api/v1/seller
sellerRouter.get('/',protectRoute,isSellerOrAdmin,getSellerProfileController)

// //update my profile
// api/v1/seller
sellerRouter.put('/',protectRoute,isSellerOrAdmin,sellerValidateUpdate,runValidation,updateMySellerProfileController)

// api/v1/seller
// //delete my account
sellerRouter.delete('/',protectRoute,isSellerOrAdmin,deleteMySellerAccountController)







export default sellerRouter

