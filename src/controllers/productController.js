import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js"; 
import cloudinary from "../config/cloudinary.js";


// @desc    Create a new product (Only Admin or Verified Seller)
// @route   POST /api/v1/products
// @access  Private (Seller or Admin)
export const createProduct = asyncHandler(async (req, res) => {
    const currentUser = req.user;
   

    //  Check if user is authenticated
    if (!currentUser) {
        res.status(401);
        throw new Error("Unauthorized. Please log in to access this resource.");
    }

    //  Allow only seller or admin
    if (currentUser.role !== "seller" && currentUser.role !== "admin") {
        res.status(403);
        throw new Error("Access denied. Only sellers or admins can create products.");
    }

    //  If role is seller, verify the seller
    if (currentUser.role === "seller") {
        const seller = await Seller.findById(currentUser.userId);

        if (!seller) {
            res.status(404);
            throw new Error("Seller account not found.");
        }

        if (!seller.isVerified) {
            res.status(403);
            throw new Error("Seller account is not verified. Please wait for verification.");
        }
    }

    const file =req.file.path
 console.log("current user product controller",file)
           if (!file) {
    res.status(400);
    throw new Error("Image file is required");
  }
     // Upload an image
         let uploadResult = await cloudinary .uploader
           .upload(file,)
           .catch((error) => {
               throw new Error("Error in Cloudinary uploader",error)
           });
        
        const uploadImage=uploadResult.secure_url;
        console.log("my image Url",uploadImage)

    //  Destructure product fields
    const {
        title,
        description,
        price,
        category,
        brand,
        stock,
        isFeatured,
    } = req.body;



    //  Create the product
    const product = await Product.create({
        sellerId: currentUser.userId,
        title,
        description,
        price,
        image:uploadImage || "",
        category,
        brand,
        stock,
        isFeatured,
    });

    // Respond to client
    res.status(201).json({
        message: " Product created successfully",
        product,
    });
});
