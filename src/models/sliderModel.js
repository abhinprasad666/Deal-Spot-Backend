import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

 const Slider= mongoose.model("Slider", sliderSchema);

export default Slider