// utils/cookieHandler.js
export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
    });
};
