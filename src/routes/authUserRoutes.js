import { Router } from "express"; 
import { loginController, logoutController, signupController } from "../controllers/authUserController.js";
import { runValidation, validateLogin, validateSignup } from "../middlewares/userValidatioinMiddleware.js";
import { upload } from "../middlewares/multer.js";





const authUserRouter=Router()



// Validation middleware added here
//singup
// api/v1/user/auth/singup
authUserRouter.post('/singup', validateSignup,runValidation,upload.single("image"),signupController);

//login
// api/v1/user/auth/login
authUserRouter.post('/login', validateLogin,runValidation,loginController);

//logout
// api/v1/user/auth/logout
authUserRouter.post('/logout',logoutController)


export default authUserRouter
