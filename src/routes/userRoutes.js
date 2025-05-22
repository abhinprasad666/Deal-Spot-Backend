import { Router } from "express";
import isAuthUser from "../middlewares/isAuthUser.js";
import { deleteMyAccountController, getMyProfileController, updateMyProfileController } from "../controllers/userController.js";





const userRouter=Router()

// get Profile
userRouter.get('/',isAuthUser,getMyProfileController)
//update my profile
userRouter.put('/',isAuthUser,updateMyProfileController)
//delete my account
userRouter.delete('/',isAuthUser,deleteMyAccountController)







export default userRouter

