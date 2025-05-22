import { body, validationResult } from "express-validator";

export const sellerRegisterValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isLength({ min: 8, max: 128 }).withMessage("Password must be between 8 and 128 characters"),

    body("shopName").notEmpty().withMessage("ShopName is required"),
    body("address").notEmpty().withMessage("Address is required"),
    // body("gstNumber").notEmpty().withMessage("GST Number is required"),
];

export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// export const sellerLoginValidation = [
//     body("email").notEmpty().withMessage("Email is required"),
//     body("password").notEmpty().withMessage("Password is required"),
    
// ];


