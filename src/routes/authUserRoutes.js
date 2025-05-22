import { Router } from "express"; 
import { loginController, logoutController, signupController } from "../controllers/authUserController.js";
import { runValidation, validateSignup } from "../middlewares/userValidatioinMiddleware.js";





const authRouter=Router()



// Validation middleware added here
authRouter.post('/singup', validateSignup,runValidation,signupController); //singup
//login
authRouter.post('/login', validateSignup,runValidation,loginController);
//logout
authRouter.post('/logout',logoutController)


export default authRouter
