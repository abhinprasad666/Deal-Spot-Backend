import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { setAuthCookie } from "../utils/cookieHandler.js";
// import cloudinary from "../config/cloudinary.js";

//     Signup new user
// POST /api/v1/auth/signup

export const signupController = asyncHandler(async (req, res) => {
    const { email } = req.body || {};
    
    // const file=req.file.path?req.file.path :""

    // const cloudinaryResponse=await cloudinary.uploader.upload(file)
    // console.log('cloudinary response',cloudinaryResponse)

    //  Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); // HTTP 400 = Bad Request
        throw new Error("User already exists");
    }

    //  Create new user with hashed password (handled in userModel pre-save middleware)
    const newUser = await User.create(req.body || {});

    if (newUser) {
        newUser.password = null; //  Remove password from response for security

        const token = generateToken(newUser._id, newUser.role); //  Generate JWT token

        setAuthCookie(res, token); // cookie on the response

        res.status(201).json({
            //  Send user details as response (excluding password)
            success: true,
            message: "Account created successfully",
            newUser,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//loginController
// @route POST /api/v1/auth/login

export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    const existUser = await User.findOne({ email });
    console.log("user", existUser);

    if (existUser && (await existUser.checkPassword(password))) {

        //  Generate JWT token and send it as a cookie
        const token = generateToken(existUser._id, existUser.role);

        setAuthCookie(res, token); // cookie on the response

        existUser.password = null; //  Remove password from response for security

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            existUser,
        });
    } else {
        throw new Error("Invalid Email or Password");
    }
});

//logoutController
// POST /api/v1/auth/logout

export const logoutController = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logout",
    });
});
