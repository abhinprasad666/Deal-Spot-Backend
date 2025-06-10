import asyncHandler from "express-async-handler";
import Slider from "../models/sliderModel.js";
import cloudinary from "../config/cloudinary.js";

export const getAllSlides = asyncHandler(async (req, res) => {
    const slides = await Slider.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        slides,
    });
});

export const createSlide = asyncHandler(async (req, res) => {
    const { title, description } = req.body || {};

    //  Get image file from multer
    const file = req.file?.path;

    if (!file) {
        res.status(400);
        throw new Error("Please provide image URL");
    }

    if (!file) {
        res.status(400);
        throw new Error("Image file is required.");
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = "";
    if (file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file, {
                folder: "dealspot/slider",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    const slide = await Slider.create({
        image: imageUrl,
        title: title || "",
        description: description || "",
    });

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

    const { title, description } = req.body || {};

    //  Get image file from multer
    const file = req.file?.path;

    if (!file) {
        res.status(400);
        throw new Error("Please provide image URL");
    }

    // Upload image to Cloudinary if file provided
    let imageUrl = "";
    if (file) {
        try {
            const uploadedResult = await cloudinary.uploader.upload(file, {
                folder: "dealspot/slider",
                resource_type: "image",
            });
            imageUrl = uploadedResult.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed. Please try again.");
        }
    }

    slide.image = imageUrl|| slide.image;
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
