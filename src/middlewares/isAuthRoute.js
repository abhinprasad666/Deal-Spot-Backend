import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuthRoute = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            await User.findById(decodedToken.userId).select("-password");

            req.currentUser = decodedToken;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Invalid token !");
        }
    } else {
        throw new Error("Unathorized !");
    }
});

export default isAuthRoute;