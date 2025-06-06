import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute";
import { createOrder, getMyOrders, getOrderById, } from "../controllers/orderController";
// import { isAdmin } from "../middlewares/roleMiddleware";





const orderRouter=Router()

// Create new order (user)
orderRouter.post("/", protectRoute, createOrder);

// Get current user's orders
orderRouter.get("/my-orders", protectRoute, getMyOrders);

// Get order by ID (user/admin)
orderRouter.get("/:id", protectRoute, getOrderById);

// // Admin: Update order status
// orderRouter.put("/:id/status", protectRoute, isAdmin, updateOrderStatus);







export default orderRouter