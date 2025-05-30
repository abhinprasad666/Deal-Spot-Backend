import { Router } from "express";
import {
    forgotPassword,
    loginController,
    logoutController,
    otpVerifyConroller,
    resetPassword,
    signupController,
} from "../controllers/authController.js";
import { runValidation, validateLogin, validateSignup } from "../middlewares/validationMiddlewares/userValidation.js";
import { check_OTP } from "../middlewares/check_OTP.js";

const authRouter = Router();



// Validation middleware added here
// @route   POST /api/v1/auth/signup
// @desc    Register a new user and log them in with a JWT cookie
// @access  Public

authRouter.post("/singup", validateSignup, runValidation, signupController);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user and set JWT token in HTTP-only cookie
// @access  Public
authRouter.post("/login", validateLogin, runValidation, loginController);

// @route   POST /api/v1/auth/logout
// @desc    Logs out the user by clearing the authentication cookie
// @access  Private
authRouter.post("/logout", logoutController);

// @route   POST /api/v1/auth/forgotPassword
// @desc    Send OTP to user's email to initiate password reset
// @access  Public
authRouter.post("/forgotPassword", forgotPassword);

// @route   POST api/v1/auth/veryfyOtp
// @desc    Verify OTP during password reset process
// @access  Private (OTP is verified for an authenticated user via reset token)
authRouter.post("/verifyOtp", check_OTP, otpVerifyConroller);

// @route   POST /api/v1/auth/resetPassword
// @desc    Reset and update the password for an authenticated user
// @access  Private (Only authenticated users)
authRouter.put("/resetPassword", check_OTP, resetPassword);

export default authRouter;
