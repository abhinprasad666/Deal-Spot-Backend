import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createOrder, getAllOrders, getMyOrders, getOrderById, getOrderStatusCounts, getTotalRevenue, } from "../controllers/orderController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
// import { isAdmin } from "../middlewares/roleMiddleware";





const orderRouter=Router()

// Create new order (user)
orderRouter.post("/", protectRoute, createOrder);

// Get current user's orders
orderRouter.get("/", protectRoute, getMyOrders);

// Get order by ID (user/admin)
orderRouter.get("/:id", protectRoute, getOrderById);


orderRouter.get("/admin/allOrders", protectRoute,isAdmin, getAllOrders);

orderRouter.get("/total/revenue", protectRoute,isAdmin, getTotalRevenue);

orderRouter.get("/status/counts", protectRoute,isAdmin, getOrderStatusCounts);

// // Admin: Update order status
// orderRouter.put("/:id/status", protectRoute, isAdmin, updateOrderStatus);







export default orderRouter