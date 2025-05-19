import { check, validationResult } from 'express-validator';

// 👇 Signup Input Validation Rules
export const validateSignup = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Valid email required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

// 👇 Error Handler Middleware for Validation
export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
