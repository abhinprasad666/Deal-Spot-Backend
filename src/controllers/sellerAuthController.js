// controllers/sellerController.js
import asyncHandler from "express-async-handler";
import Seller from "../models/sellerModel.js";
import { generateToken } from "../utils/generateToken.js";
import { setAuthCookie } from "../utils/cookieHandler.js";

// @desc    Register new seller
// @route   POST /api/v1/seller/auth/register
// @access  Public
export const registerSeller = asyncHandler(async (req, res) => {
    // user input destructuring
    const { name, email, password, shopName, address, gstNumber } = req.body;

    // check for existing seller
    const existSeller = await Seller.findOne({ email });

    if (existSeller) {
        res.status(400);
        throw new Error("Seller already exists with this email.");
    }

    //  Create new seller with hashed password (handled in sellerModel pre-save middleware)
    const newSeller = await Seller.create({
        name,
        email,
        password,
        shopName,
        address,
        gstNumber,
    });

    // check creation success
    if (newSeller) {
        const token = generateToken(newSeller._id, newSeller.role); //  Generate JWT token

        setAuthCookie(res, token); // cookie on the response
        newSeller.password = null; //  Remove password from response for security
        res.status(201).json({
            success: true,
            message: "New Seller Account Created",
            newSeller,
        });
    } else {
        res.status(500);
        throw new Error("Failed to register seller. Please try again.");
    }
});


//loginController
// @route POST /api/v1/seller/auth/login

export const sellerLoginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    const existSeller = await Seller.findOne({ email });

    if (existSeller && (await existSeller.checkPassword(password))) {

        //  Generate JWT token and send it as a cookie
        const token = generateToken(existSeller._id, existSeller.role);

        setAuthCookie(res, token); // cookie on the response

        existSeller.password = null; //  Remove password from response for security

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            existSeller,
        });
    } else {
        throw new Error("Invalid Email or Password");
    }
});


//logoutController
// POST /api/v1/seller/auth/logout

export const sellerLogoutController = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logout",
    });
});
