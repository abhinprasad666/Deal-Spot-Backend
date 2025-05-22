import { Router } from "express";
import { registerSeller, sellerLoginController, sellerLogoutController } from "../controllers/sellerAuthController.js";
import { runValidation, sellerRegisterValidation } from "../middlewares/sellerValidation.js";

const authSellerRouter = Router();

//register
authSellerRouter.post("/register", sellerRegisterValidation, runValidation, registerSeller);
//login
authSellerRouter.post("/login", sellerLoginController);
//logout
authSellerRouter.post("/logout", sellerLogoutController);

export default authSellerRouter;
