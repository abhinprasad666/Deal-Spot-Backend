import { Router } from "express";
import { registerSeller, sellerLoginController, sellerLogoutController } from "../controllers/sellerAuthController.js";
import { runValidation, sellerRegisterValidation } from "../middlewares/sellerValidation.js";

const authSellerRouter = Router();

//register
// api/v1/seller/auth/register
authSellerRouter.post("/register", sellerRegisterValidation, runValidation, registerSeller);

//login
// api/v1/seller/auth/login
authSellerRouter.post("/login", sellerLoginController);
//logout
// api/v1/user/auth/logout
authSellerRouter.post("/logout", sellerLogoutController);

export default authSellerRouter;
