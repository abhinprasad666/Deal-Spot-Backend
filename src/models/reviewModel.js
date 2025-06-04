import{Schema,model} from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add a review comment"],
      trim: true,
      minlength: [3, "Comment must be at least 5 characters"],
      maxlength: [1000, "Comment must not exceed 1000 characters"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
