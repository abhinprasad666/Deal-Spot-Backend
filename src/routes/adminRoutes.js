import { Router } from "express";
import {
    blockUnblockController,
    deleteUserOrSeller,
    getAllSellers,
    getAllUsers,
    getUserOrSellerById,
    updateRoleUserOrSeller,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { protectRoute } from "../middlewares/protectRoute.js";



const adminRouter = Router();

// @desc    Get all users (Admin only)
adminRouter.get("/users", protectRoute, isAdmin, getAllUsers); // @route   GET /api/v1/admin/Users

// @desc    Get a user or seller by ID (admin access only)
adminRouter.get("/user/:id", protectRoute, isAdmin, getUserOrSellerById); // @route   GET /api/v1/admin/user/id

// @desc    Update a user or seller's role (admin access only)
adminRouter.put("/role/:id/:role", protectRoute, isAdmin, updateRoleUserOrSeller); // @route   PUT /api/v1/admin/role/:id/role

// @desc    Get all sellers (admin access only)
adminRouter.get("/sellers", protectRoute, isAdmin, getAllSellers); // @route   GET /api/v1/admin/sellers

// @desc    Block or unblock a user or seller by admin
adminRouter.put("/block/:id", protectRoute, isAdmin, blockUnblockController); // @route   PUT /api/v1/admin/block/:id

// @desc    Delete a user or seller by admin
adminRouter.delete("/:id", protectRoute, isAdmin, deleteUserOrSeller); // @route   DELETE /api/v1/admin/:id

export default adminRouter;
