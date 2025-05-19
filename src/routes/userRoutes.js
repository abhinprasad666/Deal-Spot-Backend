import { Router } from "express";
import isAuthRoute from "../middlewares/isAuthRoute.js";
import { getProfileController } from "../controllers/userController.js";





const userRouter=Router()

// get Profile
userRouter.get('/profile',isAuthRoute,getProfileController)







export default userRouter