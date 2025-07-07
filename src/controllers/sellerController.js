import asyncHandler from "express-async-handler";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Review from "../models/reviewModel.js";


// @desc    Create Seller Account (with email/password verification)
// @route   POST /api/v1/seller
// @access  Private
export const registerController = asyncHandler(async (req, res) => {
    const { email, password, shopName, bio, address } = req.body || {};

    // Ensure the user is logged in
    if (!req.user) {
        res.status(401);
        throw new Error("Please log in to create a seller account.");
    }

    const userId = req.user.userId;

    // Find user by ID from the database
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found. Please sign up.");
    }

    //  Verify that the email matches the logged-in user's email
    if (user.email !== email) {
        res.status(401);
        throw new Error("Entered email does not match your account.");
    }

    // Verify the user's password
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
        res.status(401);
        throw new Error("Incorrect password.");
    }

    // Check if a seller account already exists for this user
    const existingSeller = await Seller.findOne({ userId });
    if (existingSeller) {
        res.status(400);
        throw new Error("Seller account already exists for this user.");
    }

    // Update user role to "seller"
    user.role = "seller";

    // Save the updated user to the database
    const savedUser = await user.save();

    // Convert the user object to plain JS and remove the password before sending response
    const userObj = savedUser.toObject();
    delete userObj.password;

    // Create a new seller record in the database
    const newSeller = await Seller.create({
        userId: user._id,
        shopName,
        bio,
        address,
    });

    // Send a success response with created seller and updated user data
    res.status(201).json({
        message: "Seller account created successfully",
        userData: userObj,
        sellerData: newSeller,
    });
});

// @route   GET /api/v1/seller/profile
// @access  Private (Seller/Admin only)
export const getSellerProfileController = asyncHandler(async (req, res) => {
    //  Get seller info from request (added by isAuthSeller middleware)
    const userId = req.user.userId || {};

    //  If seller data not found in request (edge case)
    if (!userId) {
        res.status(404);
        throw new Error("Seller info missing in request");
    }

    //  Fetch complete seller details from DB (excluding password)
    const seller = await Seller.findOne({ userId: userId }).select("-password");
    console.log("sellerInfo", seller);

    //  If seller not found in database
    if (!seller) {
        res.status(404);
        throw new Error("Seller not found !");
    }

    // Return seller profile
    res.status(200).json({
        success: true,
        sellerData: seller,
    });
});

// @desc    Update logged-in seller profile
// @route   PUT /api/v1/seller
// @access  Private (Seller only)

export const updateMySellerProfileController = asyncHandler(async (req, res) => {
    //  Get logged-in seller from request (set by isAuthSeller middleware)
    const userId = req.user.userId;

    //  Update fields if provided
    const { name, email, shopName, bio, address, gstNumber, password, profileImage, coverImage } = req.body || {};

    //  Check if seller exists
    const existSeller = await Seller.findOne({ userId: userId });

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
    const userId = req.user?.userId;

    //  Try deleting the seller from DB
    const deletedSeller = await Seller.findOneAndDelete({ userId });

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

// @route   POST /api/v1/seller/upload/dp
// @desc    Upload and update seller's profile picture
// @access  Private (Only authenticated sellers)
export const uploadSellerProfilePic = asyncHandler(async (req, res) => {
    // Get the authenticated user from request
    const user = req.user;
    if (!user) {
        res.status(401);
        throw new Error("Unauthorized. Please log in.");
    }

    //  Find the seller in DB
    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller) {
        res.status(404);
        throw new Error("User not found.");
    }

    //  Get image file from multer
    const file = req.file?.path;
    if (!file) {
        res.status(400);
        throw new Error("Image file is required.");
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = "";
    if (file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file, {
                folder: "dealspot/seller/dp",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    // Update seller's profileImage field
    seller.profilePic = imageUrl || seller.profilePic;
    await seller.save();

    // Send response
    res.status(200).json({
        success: true,
        message: " profile picture uploaded successfully.",
        seller,
    });
});

// @route   POST /api/v1/seller/upload/dp
// @desc    Upload and update seller's profile picture
// @access  Private (Only authenticated sellers)
export const uploadSellerCoverImage = asyncHandler(async (req, res) => {
    // Get the authenticated user from request
    const user = req.user;
    if (!user) {
        res.status(401);
        throw new Error("Unauthorized. Please log in.");
    }

    //  Find the seller in DB
    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller) {
        res.status(404);
        throw new Error("User not found.");
    }

    //  Get image file from multer
    const file = req.file?.path;
    if (!file) {
        res.status(400);
        throw new Error("Image file is required.");
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = "";
    if (file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file, {
                folder: "dealspot/seller/coverImg",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    // Update seller's profileImage field
    seller.coverImage = imageUrl || seller.coverImage;
    await seller.save();

    // Send response
    res.status(200).json({
        success: true,
        message: " profile cover image uploaded successfully.",
        seller,
    });
});



// @route   GET /api/v1/seller/status
// @desc    Get seller stats like total sales, total orders, total products etc.
// @access  Private (Only authenticated sellers)


export const getSellerStats = asyncHandler(async (req, res) => {
  const sellerId = req.user.userId;

  // Get all products by seller
  const products = await Product.find({ seller: sellerId });
  const productIds = products.map((p) => p._id);
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  // Get orders with those products
  const orders = await Order.find({
    "cartItems.productId": { $in: productIds },
  });

  const totalOrders = orders.length;
  let totalSales = 0;
  const uniqueUserIds = new Set();

  for (const order of orders) {
    for (const item of order.cartItems) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );

      if (product) {
        const price = product.price || 0;
        const discount = product.discount || 0;
        const offerPrice =
          discount > 0 && discount <= 100
            ? price - (price * discount) / 100
            : price;
        const finalPrice = Math.max(offerPrice, 0);

        totalSales += finalPrice * item.quantity;
        uniqueUserIds.add(order.userId.toString());
      }
    }
  }

  const totalUsers = uniqueUserIds.size;

  // Get total reviews correctly using "product" field
  const totalReviews = await Review.countDocuments({
    product: { $in: productIds },
  });

  res.status(200).json({
    success: true,
    status: {
      totalProducts,
      outOfStock,
      totalOrders,
      totalSales: Math.round(totalSales) || 0,
      totalUsers,
      totalReviews,
    },
  });
});

//get seller orders
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user?.userId;

  if (!sellerId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Step 1: Get all products by this seller
  const sellerProducts = await Product.find({ seller: sellerId }).select("_id");

  const productIds = sellerProducts.map((p) => p._id);

  if (productIds.length === 0) {
    return res.status(200).json({ success: true, orders: [] });
  }

  // Step 2: Get all orders that contain these products
  const orders = await Order.find({
    "cartItems.productId": { $in: productIds },
  })
    .sort({ orderedAt: -1 })
    .populate({
      path: "cartItems.productId",
      select: "title image price discount seller",
    })
    .populate({
      path: "userId",
      select: "name email", // optional: show user details
    });

  res.status(200).json({
    success: true,
    count:orders.length,
    orders,
    
  });
});

//get total users
export const getSellerUsers = asyncHandler(async (req, res) => {
  const sellerId = req.user.userId;

  // Seller's products
  const products = await Product.find({ seller: sellerId }).select("_id");
  const productIds = products.map((p) => p._id);

  if (productIds.length === 0) {
    return res.status(200).json({ success: true, users: [] });
  }

  // Orders with those products
  const orders = await Order.find({
    "cartItems.productId": { $in: productIds },
  }).select("userId");

  // Unique userIds
  const userIdSet = new Set(orders.map((order) => order.userId.toString()));
  const uniqueUserIds = Array.from(userIdSet);

  // Get user names from User model
  const users = await User.find({ _id: { $in: uniqueUserIds } }).select("_id name");

  res.status(200).json({
    success: true,
    users:users ||[],
    totalUsers: users.length|| 0,
  });
});