import { Router } from "express";
import { addReview, deleteReview, getProductReviews, getSellerReviews } from "../controllers/reviewController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isSellerOrAdmin } from "../middlewares/roleMiddleware.js";


const reviewRouter=Router()

// @desc    Add review to product
// @route   POST /api/v1/reviews/:productId
// @access  Private
reviewRouter.post("/:productId", protectRoute, addReview);

// @desc    Get all reviews for a product
// @route   GET /api/v1/reviews/:productId
// @access  Public
reviewRouter.get("/:productId", getProductReviews);

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private
reviewRouter.delete("/delete/:reviewId", protectRoute, deleteReview);


// @route   get/api/v1/reviews/userId
// @access  Private
reviewRouter.get("/seller/allReviews", protectRoute,isSellerOrAdmin,getSellerReviews);





export default reviewRouter