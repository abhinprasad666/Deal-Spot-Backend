import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @desc    Add a review to a product
// @route   POST /api/v1/reviews/:productId
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;
    console.log("Received comment:", comment);
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be a number between 1 and 5");
    }

    // Validate comment
    if (!comment || comment.trim().length < 3 || comment.trim().length > 1000) {
        res.status(400);
        throw new Error("Comment must be between 3 and 1000 characters");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
        res.status(400);
        throw new Error("You have already reviewed this product");
    }

    // Get user name
    const user = await User.findById(userId).select("name");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Create review
    const review = await Review.create({
        user: userId,
        name: user.name,
        rating,
        comment,
        product: productId,
    });

    // Populate user and product for response
    const populatedReview = await Review.findById(review._id)

    res.status(201).json({ message: "Review added", review: populatedReview });
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
    .populate("product", "title") // Make sure 'title' exists
    .sort({ createdAt: -1 });

  res.status(200).json(reviews);
});

// @desc    Delete a specific review (only by user or admin)
// @route   DELETE /api/v1/reviews/delete/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    // Only the reviewer or admin can delete
    if (review.user.toString() !== req.user.userId.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this review");
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
});
