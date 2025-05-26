import { Router } from "express";
import { loginController, logoutController, signupController } from "../controllers/authController.js";
import {
    runValidation,
    validateLogin,
    validateSignup,
} from "../middlewares/validationMiddlewares/userValidation.js";

const authRouter = Router();

// Validation middleware added here
//singup
// api/v1/auth/singup
authRouter.post("/singup", validateSignup, runValidation, signupController);

//login
// api/v1/auth/login
authRouter.post("/login", validateLogin, runValidation, loginController);

//logout
// api/v1/auth/logout
authRouter.post("/logout", logoutController);

export default authRouter;
