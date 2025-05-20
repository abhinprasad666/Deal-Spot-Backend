import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const isAdmin = asyncHandler(async (req, res, next) => {
    const { userId, role } = req.currentUser || {};

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
    //Allowed: admin only
    if (role === "admin") {
        return next();
    } else {
        res.status(403);
        // 403 = Forbidden: User is authenticated but not allowed to access this route
        throw new Error("Access denied. Admin only.");
    }
});
