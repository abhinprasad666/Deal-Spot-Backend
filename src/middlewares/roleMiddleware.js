
/**
 * Middleware to authorize admin users only
 */
export const isAdmin = (req, res, next) => {
    console.log("admin",req.user)
    if (req.user.role === "admin") {
        return next();
    }
    res.status(403);
    throw new Error("Access denied: Admin privileges required");
};

/**
 * Middleware to authorize sellers or admins only
 */
export const isSellerOrAdmin = (req, res, next) => {
 console.log("checking middleware role",req.user)
    if (req.user.role === "seller" || req.user.role === "admin") {
        return next();
    }
    res.status(403);
    throw new Error("Access denied: Only sellers or administrators are permitted");
};
