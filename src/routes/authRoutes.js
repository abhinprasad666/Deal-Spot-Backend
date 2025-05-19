import { Router } from "express"; 
import { runValidation, validateSignup } from "../middlewares/ValidatioinMiddleware.js";




const authRouter=Router()



// Validation middleware added here
authRouter.post('/singup', validateSignup,runValidation,);

export default authRouter
