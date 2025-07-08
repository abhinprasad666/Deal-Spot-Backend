import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { setAuthCookie } from "../utils/cookieHandler.js";
import sendPasswordResetLink from "../utils/resetPassword.js";
import { generateOTP } from "../utils/generateOTP.js";
import bcrypt from "bcrypt";

// @route   POST /api/v1/auth/signup
// @desc    Register a new user and log them in with a JWT cookie
// @access  Public

export const signupController = asyncHandler(async (req, res) => {
    const { email } = req.body || {};

    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); // 400 = Bad Request
        throw new Error("User already exists.");
    }

    // Create a new user (password hashing is handled in the User model middleware)
    const newUser = await User.create(req.body || {});

    // If user is successfully created
    if (newUser) {
        newUser.password = undefined; // Remove password from response

        // Generate JWT token with user ID and role
        const token = generateToken(newUser._id, newUser.role);

        const maxAge = 20 * 24 * 60 * 60 * 1000; // 20 days

        // Set auth token as HTTP-only cookie
        setAuthCookie(res, token, maxAge);

        // Send success response
        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: newUser,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});

// @route   POST /api/v1/auth/login
// @desc    Authenticate user and set JWT token in HTTP-only cookie
// @access  Public

export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    // Check if the user exists with the provided email
    const existUser = await User.findOne({ email });

    // If user exists and password matches
    if (existUser && (await existUser.checkPassword(password))) {
        // Generate JWT token with user ID and role
        const token = generateToken(existUser._id, existUser.role);

        // Set cookie expiration to 20 days
        const maxAge = 20 * 24 * 60 * 60 * 1000;

        // Set auth cookie in the response
        setAuthCookie(res, token, maxAge);

        // Remove password from the user object before sending it in response
        existUser.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: existUser,
        });
    }

    // If login fails
    res.status(401);
    throw new Error("Incorrect email or password. Please try again.");
});

// @route   POST /api/v1/auth/logout
// @desc    Logs out the user by clearing the authentication cookie
// @access  Private

export const logoutController = asyncHandler(async (req, res) => {
    // Clear the auth token cookie by setting it to an expired value
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production", // Optional: for HTTPS only in production
        sameSite: "strict", // Optional: prevents CSRF
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
});


// @route   POST /api/v1/auth/forgotPassword
// @desc    Send OTP to user's email to initiate password reset
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
console.log("user email",email)
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("The email address you entered is not registered with us. Please check and try again.");
  }

  // Generate OTP and hash it
  const OTP = generateOTP();
  const hashedOTP = await bcrypt.hash(OTP, 10);

  user.resetPasswordOtp = hashedOTP;
  user.resetPasswordExpire = Date.now() + 6 * 60 * 1000;
  await user.save();

  // Send OTP via Resend
  const response = await sendPasswordResetLink(user.email, OTP, user.name);
  if (response.error) {
    res.status(500);
    throw new Error("Failed to send OTP. Please try again later.");
  }

  const token = generateToken(user._id);
  setAuthCookie(res, token, 10 * 60 * 1000); // 10 mins

  res.status(200).json({
    success: true,
    email:email,
    message: "OTP sent successfully. Please check your email.",
  });
});

// @route   POST api/v1/auth/veryfyOtp
// @desc    Verify OTP during password reset process
// @access  Private (OTP is verified for an authenticated user via reset token)

export const otpVerifyConroller = asyncHandler(async (req, res) => {
    const { otp } = req.body; // OTP entered by the user
    const { resetPasswordOtp } = req.user; // Hashed OTP from DB (attached via middleware)

    // Validate if OTP is provided
    if (!otp) {
        res.status(400);
        throw new Error("OTP is required.");
    }

    // Compare entered OTP with the hashed OTP from the database
    const isCorrectOtp = await bcrypt.compare(otp, resetPasswordOtp);

    // If OTP is invalid or doesn't match
    if (!isCorrectOtp) {
        res.status(400);
        throw new Error("Invalid or expired OTP. Please try again.");
    }

    // OTP is valid
    res.status(200).json({
        success:true,
        message: "OTP verified successfully.",
    });
});

// @route   POST /api/v1/auth/resetPassword
// @desc    Reset and update the password for an authenticated user
// @access  Private (Only authenticated users)

export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body || {};
    const { userId } = req.user;

    console.log("Password received:", password);

    // Check if password is provided
    if (!password) {
        res.status(400);
        throw new Error("Password is required.");
    }

    // Check password length
    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be at least 8 characters long.");
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    // Update password and clear reset token fields
    user.password = password;
    user. resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success:true,
        message: "Password updated successfully. Please log in to continue.",
    });
});
