import { Router } from "express";
import isAuthRoute from "../middlewares/isAuthRoute.js";
import { deleteMyAccountController, getMyProfileController, updateMyProfileController } from "../controllers/userController.js";





const userRouter=Router()

// get Profile
userRouter.get('/profile',isAuthRoute,getMyProfileController)
//update my profile
userRouter.put('/update',isAuthRoute,updateMyProfileController)
//delete my account
userRouter.delete('/delete',isAuthRoute,deleteMyAccountController)







export default userRouter

"feat(user): add profile view, update & delete features for users"
"refactor(user): rename route handler functions for consistency"
