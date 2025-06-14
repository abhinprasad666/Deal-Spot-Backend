import { Router } from "express";
import { deleteMyAccountController,getMyProfileController,updateMyProfileController, uploadProfilePic } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { upload } from "../middlewares/multer.js";
import { runValidation, validateUpdate } from "../middlewares/validationMiddlewares/userValidation.js";




const userRouter=Router()

// get Profile
// api/v1/user
userRouter.get('/me',protectRoute,getMyProfileController)

//update my profile
// api/v1/user
userRouter.put('/',protectRoute,validateUpdate,runValidation,updateMyProfileController)

// api/v1/user
//delete my account
userRouter.delete('/',protectRoute,deleteMyAccountController)

// @route   POST /api/v1/upload/dp
// @desc    Upload an image to Cloudinary
// @access  Private (Authenticated users)
userRouter.put("/upload/dp", protectRoute,upload.single("image"),uploadProfilePic);





export default userRouter

