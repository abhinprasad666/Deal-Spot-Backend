import { Router } from "express";
import { deleteMyAccountController, getMyProfileController, updateMyProfileController } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { runValidation, validateUpdate } from "../middlewares/userValidatioinMiddleware.js";






const userRouter=Router()

// get Profile
// api/v1/user/profile
userRouter.get('/',protectRoute,getMyProfileController)

//update my profile
// api/v1/user/profle
userRouter.put('/',protectRoute,validateUpdate,runValidation,updateMyProfileController)

// api/v1/user/profile
//delete my account
userRouter.delete('/',protectRoute,deleteMyAccountController)







export default userRouter

