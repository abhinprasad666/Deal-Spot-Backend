import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";


// @desc    Add a review to a product
// @route   POST /api/v1/reviews/:productId
// @access  Private


export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;
  const userId = req.user.userId;

  //  Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  //  Validate rating
  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  // Validate comment
  if (
    !comment ||
    typeof comment !== "string" ||
    comment.trim().length < 3 ||
    comment.trim().length > 1000
  ) {
    res.status(400);
    throw new Error("Comment must be a string between 3 and 1000 characters");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  // Get user info
  const user = await User.findById(userId).select("name");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create the new review
  const newReview = await Review.create({
    user: userId,
    name: user.name,
    rating,
    comment,
    product: productId,
  });

  // Push to product reviews and save
  product.reviews.push(newReview._id);
  await product.save();

  // Update product average rating
  await Product.updateRating(productId); // static method in Product model

  // Update Order model - set isReview = rating
  await Order.updateMany(
    {
      userId: userId,
      "cartItems.productId": productId,
    },
    {
      $set: { "cartItems.$[elem].isReview": rating },
    },
    {
      arrayFilters: [
        {
          "elem.productId": new mongoose.Types.ObjectId(productId), // 👈 convert to ObjectId
        },
      ],
    }
  );

  //Populate product title in response
  const populatedReview = await newReview.populate({
    path: "product",
    select: "title",
  });

  //  Send response
  res.status(201).json({
    message: "Review added successfully",
    review: populatedReview,
  });
});


// @desc    Get all reviews for a specific product
// @route   GET /api/v1/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const reviews = await Review.find({ product: productId })
    .populate("user", "name email")
    .populate("product", "title image",) // Make sure 'title' exists
    .sort({ createdAt: -1 });

  res.status(200).json(
   { success:true,
     reviews});
});

// @desc    Delete a specific review (only by user or admin)
// @route   DELETE /api/v1/reviews/delete/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.userId;

    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400);
        throw new Error("Invalid review ID");
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    //  Check permission (reviewer or admin only)
    if (review.user.toString() !== userId && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this review");
    }

    // Get product before deleting review
    const product = await Product.findById(review.product);
    if (!product) {
        res.status(404);
        throw new Error("Related product not found");
    }

    //  Delete the review
    await review.deleteOne();

    //  Remove review ID from product.reviews array
    product.reviews = product.reviews.filter(
        (r) => r.toString() !== review._id.toString()
    );
    await product.save();

    //  Update rating and numOfReviews
    await Product.updateRating(product._id);

    //  Send response
    res.status(200).json({ message: "Review deleted successfully" });
});

//get seller all reviews
// controllers/reviewController.js



// GET /api/reviews/user/:userId


export const getSellerReviews = asyncHandler(async (req, res) => {
  const sellerId = req.user.userId;

  const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
  const productIds = sellerProducts.map((product) => product._id);

  const reviews = await Review.find({ product: { $in: productIds } })
    .populate("product", "title image rating")
    .populate("user", "name email") 
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate("product", "title image rating")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});