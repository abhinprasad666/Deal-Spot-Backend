import { body, validationResult } from "express-validator";

export const sellerRegisterValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8, max: 128 }).withMessage("Password must be between 8 and 128 characters"),

    body("shopName").notEmpty().withMessage("ShopName is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Email format is invalid")
        .normalizeEmail(),
    // body("gstNumber").notEmpty().withMessage("GST Number is required"),
];

// 👇 seller update Input Validation Rules
export const sellerValidateUpdate = [
    // Email: validate only if provided
    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    // Password: validate only if provided
    body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
