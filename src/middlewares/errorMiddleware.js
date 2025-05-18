// Middleware to handle 404 - Not Found errors
export const notFound = (req, res, next) => {
    // Create a new error object with the requested URL that was not found
    const error = new Error(`Not Found: ${req.originalUrl}`);
    // Pass the error to the next middleware (which is the error handler)
    next(error);
};

// General error handling middleware
export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    let message = err.message;

    // Send the error response as JSON
    res.status(statusCode).json({
        error: message,
        // Include stack trace only in development mode for debugging
        stack: process.env.NODE_ENV !== "development" ? null : err.stack,
    });
};
