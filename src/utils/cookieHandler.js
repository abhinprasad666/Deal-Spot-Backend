// utils/cookieHandler.js
export const setAuthCookie = (res, token,maxAge) => {
    res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: maxAge
    });
};
