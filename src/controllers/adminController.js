import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    // Check if the user is logged in and is an admin
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    // Fetch all users from the database (excluding password)
   const users = await User.find({ role: "customer" }).select("-password");

    // Return the list of users
    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});



// @desc    Get all sellers (admin access only)
// @route   GET /api/v1/admin/sellers
// @access  Private/Admin
export const getAllSellers = asyncHandler(async (req, res) => {
    // Check if the requester is an admin
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    // Fetch all users with role 'seller', excluding password
  const sellers = await User.find({ role: "seller" }).select("-password");

    //  Return seller list with count
    res.status(200).json({
        success: true,
        count: sellers.length,
        sellers,
    });
});


// @desc    Get a user or seller by ID (admin access only)
// @route   GET /api/v1/admin/user/:id
// @access  Private/Admin
export const getUserOrSellerById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Check if the requester is an admin
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    // Fetch the user (or seller) by ID, excluding password
    const user = await User.findById(userId).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Send user/seller details to admin
    res.status(200).json({
        success: true,
        user,
    });
});

// @desc    Update a user or seller's role (admin access only)
// @route   PUT /api/v1/admin/user/:id/role
// @access  Private/Admin
export const updateRoleUserOrSeller = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const role = req.params.role;

    // Check if the requester is an admin
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }
    // Validate incoming role
    const allowedRoles = ["customer", "seller","admin"];
    if (!allowedRoles.includes(role)) {
        res.status(400);
        throw new Error(`Invalid role. Allowed roles: ${allowedRoles}`);
    }

    //  Find the user
    const user = await User.findById({ _id: userId });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    //  Update role and save
    user.role = role;

    await User.create(user);

    //  Respond with updated user info
    res.status(200).json({
        success: true,
        message: `User role updated to '${user.role}' successfully`,
        user,
    });
});


// @desc    Block or unblock a user or seller by admin
// @route   PUT /api/v1/admin/block/:id
// @access  Private/Admin
export const blockUnblockController = asyncHandler(async (req, res) => {
    const userId = req.params.id;
   
    // Only admin can perform this action
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    //  Find the user
    const user = await User.findById({ _id: userId });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    switch (user.status) {
        case "active":
            user.status = "blocked";
            break;
        case "blocked":
            user.status = "active";
            break;
        default:
            res.status(401);
            throw new Error("Invalid status.");
    }

    //Save updated user to DB
    await user.save();
    // Return response
    res.status(200).json({
        success: true,
        message: `User status updated to '${user.status}'`,
        user,
    });
});


// @desc    Delete a user or seller by admin
// @route   DELETE /api/v1/admin/:id
// @access  Private/Admin
export const deleteUserOrSeller = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  //  Check if the logged-in user is an admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }

  //  Find the user or seller
  const user = await User.findById({_id:userId});

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //  Delete the user/seller
  await user.deleteOne();

  //  Respond with success
  res.status(200).json({
    success: true,
    message: `User '${user.name}' with role '${user.role}' has been deleted.`,
  });
});

