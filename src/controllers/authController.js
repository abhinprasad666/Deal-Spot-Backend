import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

//     Signup new user
// POST /api/v1/auth/signup

export const signupController = asyncHandler(async (req, res) => {
    const { email } = req.body || {};

    // 1️ Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); // HTTP 400 = Bad Request
        throw new Error("User already exists");
    }

    // 2️ Create new user with hashed password (handled in userModel pre-save middleware)
    const newUser = await User.create(req.body || {});

    if (newUser) {
        // 3️ Remove password from response for security
        newUser.password = null;

        // 4️ Generate JWT token and send it as a cookie
        const token = generateToken(newUser._id, newUser.role);

        res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production", // HTTPS in production
            sameSite: "strict", // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
        });

        // 5️ Send user details as response (excluding password)
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            newUser,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});
