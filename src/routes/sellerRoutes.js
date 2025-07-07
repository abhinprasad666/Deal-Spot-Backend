import { Router } from "express";
import { deleteMySellerAccountController, getSellerOrders, getSellerProfileController, getSellerStats, getSellerUsers, registerController, updateMySellerProfileController, uploadSellerCoverImage, uploadSellerProfilePic } from "../controllers/sellerController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";
import { runValidation, sellerRegisterValidation, sellerValidateUpdate } from "../middlewares/validationMiddlewares/sellerValidation.js";
import { upload } from "../middlewares/multer.js";





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

// @route   Put /api/v1/seller/upload/dp
// @desc    Upload an image to Cloudinary
// @access  Private (Only authenticated sellers or admin)
sellerRouter.put("/upload/dp", protectRoute,isSellerOrAdmin,upload.single("image"),uploadSellerProfilePic);

// @route   Put /api/v1/seller/upload/coverImage
// @desc    Upload an image to Cloudinary
// @access  Private (Only authenticated sellers or admin)
sellerRouter.put("/upload/coverImage", protectRoute,isSellerOrAdmin,upload.single("image"),uploadSellerCoverImage);

// get status
// api/v1/seller/status
sellerRouter.get('/status',protectRoute,isSellerOrAdmin,getSellerStats)

// get seller orders
// api/v1/seller/orders
sellerRouter.get('/orders',protectRoute,isSellerOrAdmin,getSellerOrders)

// get seller users
// api/v1/seller/users
sellerRouter.get('/users',protectRoute,isSellerOrAdmin,getSellerUsers)



export default sellerRouter

