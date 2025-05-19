import { Router } from "express"; 
import { signupController } from "../controllers/authController.js";
import { runValidation, validateSignup } from "../middlewares/ValidatioinMiddleware.js";





const authRouter=Router()



// Validation middleware added here
authRouter.post('/singup', validateSignup,runValidation,signupController);

export default authRouter
