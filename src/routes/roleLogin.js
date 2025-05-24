import { Router } from "express";
import { runValidation, validateLogin } from "../middlewares/userValidatioinMiddleware.js";

const loginRouter=Router()





loginRouter.post("/",validateLogin,runValidation,roleLoginController)



export default loginRouter