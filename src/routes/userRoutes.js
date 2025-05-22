import { Router } from "express";
import isAuthRoute from "../middlewares/isAuthRoute.js";
import { deleteMyAccountController, getMyProfileController, updateMyProfileController } from "../controllers/userController.js";





const userRouter=Router()

// get Profile
userRouter.get('/',isAuthRoute,getMyProfileController)
//update my profile
userRouter.put('/',isAuthRoute,updateMyProfileController)
//delete my account
userRouter.delete('/',isAuthRoute,deleteMyAccountController)







export default userRouter

