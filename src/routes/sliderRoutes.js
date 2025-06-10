import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { createSlide, deleteSlide, getAllSlides, updateSlide } from "../controllers/sliderController.js";
import { upload } from "../middlewares/multer.js";





const sliderRouter=Router()


// Public route - get all slides
sliderRouter.get('/', getAllSlides);


// Admin routes - create, update, delete slides
sliderRouter.post('/', protectRoute, isAdmin,upload.single("image"), createSlide);
sliderRouter.put('/:id', protectRoute, isAdmin, updateSlide);
sliderRouter.delete('/:id', protectRoute, isAdmin, deleteSlide);





export default sliderRouter