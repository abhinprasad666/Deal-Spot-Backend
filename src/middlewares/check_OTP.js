import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to check and verify OTP token from cookies
export const check_OTP = asyncHandler(async (req, res, next) => {
  //  Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("No OTP token provided."); // Clear error message
  }

  try {
    //  Decode and verify token using JWT secret key
    const decodedOtp = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Structure: { userId: ..., iat: ..., exp: ... }

    //  Find user from DB based on userId from token
  const user = await User.findById(decodedOtp.userId).select("+resetPasswordOtp");

    // If user not found
    if (!user) {
      res.status(401);
      throw new Error("User not found. Access denied.");
    }

   // Attach necessary details to req
req.user = {
  userId: user._id,
  resetPasswordOtp: user.resetPasswordOtp, // now directly from DB
};

    // ⏭ 6. Proceed to the next route or middleware
    next();
  } catch (error) {
    console.error("OTP verification error:", error.message); // Log for debugging
    res.status(401);
    throw new Error("Invalid or expired OTP token.");
  }
});
