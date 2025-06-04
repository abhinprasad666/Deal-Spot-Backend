import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";




// @desc   Get logged-in user's profile
// @route   GET /api/v1/users
// @access  Private
export const getMyProfileController = asyncHandler(async (req, res) => {
    //  Get user info from request (added by isAuthUser middleware)
    const user = req.user || {};

    //  If user not found, throw error
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Send user data as JSON (without password)
    res.status(200).json(user);
});

// @desc    Update logged-in user's profile
// @route   PUT /api/v1/users
// @access  Private
export const updateMyProfileController = asyncHandler(async (req, res) => {
    // Get user ID from middleware (set in isAuth middleware)
    const userId = req.user.userId;

    const { name, email, password } = req.body || {};

    // Find the user
    const existUser = await User.findById(userId);

    if (!existUser) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update password only if provided and valid
    if (password) {
        if (password.length < 8) {
            res.status(400);
            throw new Error("Password must be at least 8 characters");
        }
        existUser.password = password; // Pre-save hook will hash it
    }

    // Update name and email if provided
    existUser.name = name || existUser.name;
    existUser.email = email || existUser.email;

    // Save updated user
    const updatedUser = await existUser.save();

    // Avoid sending password in response
    updatedUser.password = null;

    res.status(200).json({
        success: true,
        message: "Profile Updated",
        updatedUser,
    });
});


// @desc    Permanently delete logged-in user's account
// @route   DELETE /api//v1/users
// @access  Private
export const deleteMyAccountController = asyncHandler(async (req, res) => {
    //  Get logged-in user ID from auth middleware
    const userId = req.user.userId;

    //  Try deleting the user from DB
    const deletedUser = await User.findByIdAndDelete(userId);

    //  If not found, throw error
    if (!deletedUser) {
        res.status(404);
        throw new Error("User not found or already deleted");
    }

    //  Clear JWT token cookie
    res.clearCookie("token");

    //  Send confirmation response
    res.status(200).json({ message: "Account permanently deleted." });
});

/// @route   POST /api/v1/upload/dp
// @desc    Upload and update user's profile picture on Cloudinary
// @access  Private (Authenticated users)
export const uploadProfilePic = asyncHandler(async (req, res) => {
    //  Get authenticated user from request (added by middleware)
    const user = req.user || {};
    console.log("user", user);

    //  Check if user is authenticated
    if (!user) {
        res.status(401);
        throw new Error("Unauthorized. Please log in to access this resource.");
    }

    // Check if user exists in DB
    const existUser = await User.findById(user.userId);
    if (!existUser) {
        res.status(404);
        throw new Error("User not found");
    }

    // Get image file path from multer
    const file = req.file?.path;
    if (!file) {
        res.status(400);
        throw new Error("Image file is required");
    }

      // Upload image to Cloudinary if file provided
      let imageUrl = "";
      if (file) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file, {
            folder: "dealspot/categories",
            resource_type: "image",
          });
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          res.status(500);
          throw new Error("Image upload failed. Please try again.");
        }
      }
    

    //  Save image URL to user's profilePic field
    existUser.profilePic = imageUrl || existUser.profilePic;

    //  Remove password from response for security
    existUser.password = null;

    //  Send success response
    res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully.",
        existUser,
    });
});




