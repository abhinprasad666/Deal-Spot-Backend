import { Router } from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";
// import { protectRoute } from "../middlewares/protectRoute.js";





const paymentRouter=Router()



// Create a new Razorpay order
paymentRouter.post("/create-order", createRazorpayOrder);

// Verify Razorpay signature (called from frontend redirect after payment)
paymentRouter.post("/verify", verifyPayment);

// // Save payment details to DB after successful verification
// paymentRouter.post("/store", protectRoute, storePayment);





export default paymentRouter