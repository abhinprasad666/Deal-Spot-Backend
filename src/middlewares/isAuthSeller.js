import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Seller from "../models/sellerModel.js";


// @desc    Middleware to verify JWT token and authenticate user
// @access  Protected Routes Only
 export const isAuthSeller = asyncHandler(async (req, res, next) => {
    //  Get token from cookies
    const token = req.cookies.token;

    if (token) {
        try {
            //  Verify token using secret key
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  Find user in DB using userId from token
            const seller = await Seller.findById(decodedToken.userId).select("-password");

            //  If no user found, throw unauthorized error
            if (!seller) {
                res.status(401);
                throw new Error("seller not found with this token!");
            }

            //  Attach seller to request object for further use
            req.seller = decodedToken;

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

export default isAuthSeller;
