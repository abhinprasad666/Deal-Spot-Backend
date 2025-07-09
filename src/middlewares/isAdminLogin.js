import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const isAdminLogin = asyncHandler(async (req, res, next) => {
  const { email } = req.body ||{}

 

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Admin not found");
  }

  if (user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied: Admin privileges required");
  }

  next();
});