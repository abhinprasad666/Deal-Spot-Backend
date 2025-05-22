import { Router } from "express";
import authUserRouter from "./authUserRoutes.js";
import userRouter from "./userRoutes.js";
import productRouter from "./productRoutes.js";
import authSellerRouter from "./authSellerRoutes.js";
import adminRouter from "./adminRoutes.js";
import reviewRouter from "./reviewRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import cartRouter from "./cartRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import sellerRouter from "./sellerRoutes.js";



const router=Router()


//auth user router
router.use('/user/auth',authUserRouter);
//user router
router.use('/user/profile',userRouter);
//auth seller router
router.use('/seller/auth',authSellerRouter);
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






export default router