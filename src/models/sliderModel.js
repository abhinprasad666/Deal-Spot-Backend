import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: [true, "Image URL is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

 const Slider= mongoose.model("Slider", sliderSchema);

export default Slider