import asyncHandler from "express-async-handler";
import Seller from "../models/sellerModel.js";


// Seller signup controller
// User must be logged in, req.user._id is available

export const sellerRegister = asyncHandler(async (req, res) => {
    const sellerId = req.currentUser.userId // from auth middleware

    // Check if seller profile already exists for this user
    const sellerExists = await Seller.findOne({ sellerId });
    if (sellerExists) {
        res.status(400);
        throw new Error("Seller profile already exists for this user");
    }

    const { shopName, bio, address, gstNumber, profileImage, coverImage } = req.body || {};

    // Create new seller profile
    const seller = await Seller.create({
        seller: sellerId,
        shopName,
        bio: bio || "",
        address,
        gstNumber,
        profileImage: profileImage || "",
        coverImage: coverImage || "",
        isVerified: false,
        role: "seller",
        statusUpdatedAt: Date.now(),
        totalProfit: 0,
    });

    if (seller) {
        res.status(201).json(
         {   success:true,
            message:"Seller Account Created",
            seller});
    } else {
        res.status(400);
        throw new Error("Invalid seller data");
    }
});
