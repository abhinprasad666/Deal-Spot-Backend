//create product 
import { body,validationResult } from "express-validator";

export const validateCreateProduct = [
    body("title")
        .notEmpty()
        .withMessage("Product title is required")
        .isLength({ max: 100 })
        .withMessage("Product title must not exceed 100 characters"),

    body("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),

    body("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("stock")
        .notEmpty()
        .withMessage("Count in stock is required")
        .isInt({ min: 1 })
        .withMessage("Count in stock must be a non-negative integer"),

    body("brand")
        .optional()
        .isString()
        .withMessage("Brand must be a string"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID"),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false")
    
];

export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};