import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

/**
 * @desc    Middleware to protect routes by verifying user authentication
 * @route   Protected Routes
 * @access  Private (Authenticated Users Only)
 */
export const protectRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        res.status(401);
        throw new Error("No token provided. Please log in to continue.");
    }

    try {
        // Verify and decode the token using the secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decodedToken.userId).select("-password");

        // If no user is found in the database
        if (!user) {
            res.status(401);
            throw new Error("User not found. Access denied.");
        }

        // Attach the fetched user object to the request
        req.user = decodedToken;

        // Continue to the next middleware or route
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Invalid or expired token.");
    }
});
