import { Router } from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";





const adminRouter=Router()

// @route   GET /api/v1/admin/users
// @desc    Get all users (Admin only)
// @access  Private
adminRouter.get("/users",isAdmin,getAllUsers);






export default adminRouter