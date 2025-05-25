import { body, validationResult, } from "express-validator";

//  Signup Input Validation Rules
export const  validateSignup = [
    body("name", "Name is required").notEmpty(),
 body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),,
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Email format is invalid")
        .normalizeEmail(),
];


//  user update Input Validation Rules
export const validateUpdate = [
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

//  all users  Input Validation Rules
export const validateLogin = [
    body('email', 'Valid email required').isEmail(),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Email format is invalid")
        .normalizeEmail(),
];

//  Error Handler Middleware for Validation
export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
