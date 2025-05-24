import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Check if the user is logged in and is an admin
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }

  // Fetch all users from the database (excluding password)
  const users = await User.find().select("-password");

  // Return the list of users
  res.status(200).json({
    success:true,
    count:users.length,
    users
  });
});

export { getAllUsers };

//Get Single User by ID
//Update User Role

//Get All sellers
//Get Single seller by ID
//Update seller Role

// get all products
//get all block users ...

//users
