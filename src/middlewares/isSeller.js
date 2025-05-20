import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const isSeller = asyncHandler(async (req, res, next) => {
    const { userId, role } = req.currentUser || {};
    console.log('sis seller',role,userId)
    //  Check if user is authenticated
    if (!userId) {
        // 401 = Unauthorized: User is not logged in
        res.status(401);
        throw new Error("Not authenticated");
    }

    // Find the user in the database to ensure they exist
    const currentUser = await User.findById({ _id: userId });

    if (!currentUser) {
        res.status(404);
        throw new Error("User not found");
    }
    //Allowed: seller or admin
    if (role === "seller" || role === "admin") {
        return next();
    } else {
        res.status(403);
        // 403 = Forbidden: User is authenticated but not allowed to access this route
        throw new Error("Access denied. Seller or Admin only.");
    }
});
