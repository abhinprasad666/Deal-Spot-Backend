import asyncHandler from "express-async-handler";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js";


// @route   GET /api/v1/seller/profile
// @access  Private (Seller/Admin only)
export const getSellerProfileController = asyncHandler(async (req, res) => {
    //  Get seller info from request (added by isAuthSeller middleware)
    const user = req.user.userId || {};
 console.log('seller control',user)
    //  If seller data not found in request (edge case)
    if (!user) {
        res.status(404);
        throw new Error("Seller info missing in request");
    }

    //  Fetch complete seller details from DB (excluding password)
    const seller = await Seller.findById(user).select("-password");

    //  If seller not found in database
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found !");
    }

    // Return seller profile
    res.status(200).json({
        success: true,
        message: `${seller.role}`,
        seller,
    });
});

// @desc    Update logged-in seller profile
// @route   PUT /api/v1/seller
// @access  Private (Seller only)

export const updateMySellerProfileController = asyncHandler(async (req, res) => {
    //  Get logged-in seller from request (set by isAuthSeller middleware)
    const seller = req.user.userId;

    //  Update fields if provided
    const { name, email, shopName, bio, address, gstNumber, password, profileImage, coverImage } = req.body || {};

    //  Check if seller exists
    const existSeller = await Seller.findOne({ _id: seller });

    if (!existSeller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    // If password is provided, update it (will be hashed by pre-save hook)
    if (password) {
        if (password.length < 8) {
            res.status(400);
            throw new Error("Password must be at least 8 characters");
        }
        await existSeller.checkPassword(password);
        existSeller.password = password; // this will trigger pre('save') middleware
    }

    existSeller.name = name ? name : existSeller.name;
    existSeller.email = email ? email : existSeller.email;
    existSeller.profileImage = profileImage ? profileImage : existSeller.profileImage;
    existSeller.shopName = shopName ? shopName : existSeller.shopName;
    existSeller.bio = bio ? bio : existSeller.bio;
    existSeller.address = address ? address : existSeller.address;
    existSeller.gstNumber = gstNumber ? gstNumber : existSeller.gstNumber;
    existSeller.coverImage = coverImage ? coverImage : existSeller.coverImage;

    //  Save updated user
    const updatedSeller = await existSeller.save();

    updatedSeller.password = null; //  Remove password from response for security

    // Return updated user data (without password)
    res.status(200).json({
        success: true,
        message: "Profile Updated",
        updatedSeller,
    });
});

// @desc    Permanently delete logged-in seller's account
// @route   DELETE /api//v1/seller
// @access  Private
export const deleteMySellerAccountController = asyncHandler(async (req, res) => {
    //  Get logged-in user ID from auth middleware
    const sellerId = req.user?.userId;

    //  Try deleting the seller from DB
    const deletedSeller = await Seller.findByIdAndDelete(sellerId);

    //  If not found, throw error
    if (!deletedSeller) {
        res.status(404);
        throw new Error("Seller not found or already deleted");
    }

    //  Clear JWT token cookie
    res.clearCookie("token");

    //  Send confirmation response
    res.status(200).json({ message: "Account permanently deleted." });
});
