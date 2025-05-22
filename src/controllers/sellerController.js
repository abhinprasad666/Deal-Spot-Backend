import asyncHandler from "express-async-handler";
import Seller from "../models/sellerModel.js";

// @route   GET /api/v1/seller/profile
// @access  Private (Seller/Admin only)
export const getSellerProfileController = asyncHandler(async (req, res) => {
    //  Get seller info from request (added by isAuthSeller middleware)
    const sellerData = req.seller;

    //  If seller data not found in request (edge case)
    if (!sellerData) {
        res.status(404);
        throw new Error("Seller info missing in request");
    }

    //  Fetch complete seller details from DB (excluding password)
    const seller = await Seller.findById(sellerData.userId).select("-password");

    //  If seller not found in database
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found");
    }

    // ✅ Return seller profile
    res.status(200).json({
        success: true,
        message: `${seller.role}`,
        seller,
    });
});
