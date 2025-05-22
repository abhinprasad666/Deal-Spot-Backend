import { Router } from "express";
import { registerSeller, sellerLoginController, sellerLogoutController } from "../controllers/sellerAuthController.js";
import { runValidation, sellerRegisterValidation } from "../middlewares/sellerValidation.js";

const sellerRouter = Router();

//register
sellerRouter.post("/register", sellerRegisterValidation, runValidation, registerSeller);
//login
sellerRouter.post("/login", sellerLoginController);
//logout
sellerRouter.post("/logout", sellerLogoutController);

export default sellerRouter;
