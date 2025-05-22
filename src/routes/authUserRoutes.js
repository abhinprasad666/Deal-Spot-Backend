import { Router } from "express"; 
import { loginController, logoutController, signupController } from "../controllers/authUserController.js";
import { runValidation, validateSignup } from "../middlewares/userValidatioinMiddleware.js";





const authUserRouter=Router()



// Validation middleware added here
authUserRouter.post('/singup', validateSignup,runValidation,signupController); //singup
//login
authUserRouter.post('/login', validateSignup,runValidation,loginController);
//logout
authUserRouter.post('/logout',logoutController)


export default authUserRouter
