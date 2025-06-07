import { Router } from "express";
import userRouter from "./userRoutes.js";
import productRouter from "./productRoutes.js";
import adminRouter from "./adminRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import cartRouter from "./cartRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import sellerRouter from "./sellerRoutes.js";
import authRouter from "./authRoutes.js";
import sliderRouter from "./sliderRoutes.js";



const router=Router()


//auth Allusers router
router.use('/auth',authRouter);
//user router
router.use('/user',userRouter);
// seller router
router.use('/seller',sellerRouter);
//admin router
router.use('/admin',adminRouter);
//product router
router.use('/product',productRouter);
//review router
router.use('/review',reviewRouter);
//category router
router.use('/category',categoryRouter);
//cart router
router.use('/cart',cartRouter);
//payment router
router.use('/payment',paymentRouter)
//slider router
router.use('/slider',sliderRouter)






export default router