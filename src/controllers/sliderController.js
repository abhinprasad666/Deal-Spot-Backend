import asyncHandler from 'express-async-handler'
import Slider from '../models/sliderModel.js';

export const getAllSlides = asyncHandler(async (req, res) => {
  const slides = await Slider.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    slides,
  });
});

export const createSlide = asyncHandler(async (req, res) => {
  const { img, title, description } = req.body;

  if (!img || !title || !description) {
    res.status(400);
    throw new Error("Please provide image URL, title and description");
  }

  const slide = new Slider({ img, title, description });
  await slide.save();

  res.status(201).json({
    message: "slide created",
    success: true,
    slide,
  });
});

export const updateSlide = asyncHandler(async (req, res) => {
  const slide = await Slider.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error("Slide not found");
  }

  const { img, title, description } = req.body;

  slide.img = img || slide.img;
  slide.title = title || slide.title;
  slide.description = description || slide.description;

  await slide.save();

  res.status(200).json({
    message: "updated successfully",
    success: true,
    slide,
  });
});

export const deleteSlide = asyncHandler(async (req, res) => {
  const slide = await Slider.findById(req.params.id);

  if (!slide) {
    res.status(404);
    throw new Error("Slide not found");
  }

  await slide.remove();

  res.status(200).json({ message: "Slide deleted successfully" });
});
