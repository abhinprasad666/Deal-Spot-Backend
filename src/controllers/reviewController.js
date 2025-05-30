import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Add a new review to a product
// @route   POST /api/reviews/:productId
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed the product
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  // Create new review
  const review = new Review({
    user: req.user._id,
    reviewerName: req.user.name,
    rating: Number(rating),
    comment,
    product: productId,
  });

  await review.save();

  res.status(201).json({
     success:true,
     message: "Review added successfully",
     review });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId }).populate(
    "user",
    "name email"
  );

  res.json(reviews);
});

// @desc    Delete a review by ID
// @route   DELETE /api/reviews/delete/:id
// @access  Private (user who posted the review or admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Only the user who wrote the review or an admin can delete it
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("You are not authorized to delete this review");
  }

  await review.remove();

  res.json({ message: "Review deleted successfully" });
});
