import { body, validationResult } from "express-validator";

export const sellerSignupValidation = [
  
  body("shopName").notEmpty().withMessage("Shop name is required"),
//   body("gstNumber").notEmpty().withMessage("GST number is required"),
  body("address").notEmpty().withMessage("Address is required"),
];

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
