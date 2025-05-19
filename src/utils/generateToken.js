import jwt from "jsonwebtoken";

// @desc    Generate JWT and send as secure cookie
// @params  userId: MongoDB _id of the user
// @params  role: role of the user (customer, seller, admin etc.)
export const generateToken = (userId, role) => {
  

    // Generate token with expiry
    const token = jwt.sign({userId,role}, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d", // token valid for 7 days
    });

    return token;
};
