import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// @desc    Middleware to verify JWT token and authenticate user
// @access  Protected Routes Only
const isAuthUser = asyncHandler(async (req, res, next) => {
    //  Get token from cookies
    const token = req.cookies.token;

    if (token) {
        try {
            //  Verify token using secret key
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  Find user in DB using userId from token
            const user = await User.findById(decodedToken.userId).select("-password");

            //  If no user found, throw unauthorized error
            if (!user) {
                res.status(401);
                throw new Error("User not found with this token!");
            }

            //  Attach user to request object for further use
            req.user = decodedToken;

            //  Continue to next middleware/controller
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Invalid token!");
        }
    } else {
        //  If no token found, block access
        res.status(401);
        throw new Error("Unauthorized! Token missing.");
    }
});

export default isAuthUser;
