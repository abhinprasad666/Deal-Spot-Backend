import { check, validationResult, body } from "express-validator";

// 👇 Signup Input Validation Rules
export const validateSignup = [
    check("name", "Name is required").notEmpty(),
    // check('email', 'Valid email required').isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Email format is invalid")
        .normalizeEmail(),
];

// 👇 user update Input Validation Rules
export const validateUpdate = [
    // Email: validate only if provided
    check("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    // Password: validate only if provided
    check("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

// 👇 Error Handler Middleware for Validation
export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
