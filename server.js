import express from "express";
import { config } from "dotenv";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";
import DB_Connect from "./src/config/DB_Connect.js";
import router from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed origins - include local and environment-based URLs
const allowedOrigins = [
   "deal-spot-admin.netlify.app",
    "http://localhost:5173", // Local frontend
    process.env.FRONTEND_URL?.trim(), // Deployed frontend
    process.env.ADMIN_FRONTEND_URL?.trim(), // Deployed admin panel
].filter(Boolean); // Removes undefined/null

console.log("Allowed Origins:", allowedOrigins); // Debug log

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        console.log(" Incoming origin:", origin); // See what origin is received

        // Allow non-browser tools like Postman (origin === undefined/null)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow request
        } else {
            console.error(" CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies & credentials from frontend
};
//  Apply CORS middleware
app.use(cors(corsOptions));
// HTTP request logger for debugging and monitoring
app.use(morgan());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from the request headers
app.use(cookieParser());

app.get("/favicon.ico", (req, res) => res.status(204).end());

// Main API routes prefix
app.use("/api/v1", router);

// Handle 404 - Route not found
app.use(notFound);

// Global error handling middleware
app.use(errorHandler);

// Start the server and connect to the database
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT} Mode:${process.env.NODE_ENV}`);
    DB_Connect();
});
