import express from "express";
import { config } from "dotenv";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";
import DB_Connect from "./src/config/DB_Connect.js";
import router from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';

// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration to allow requests from the frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "", // Frontend URL
  credentials: true, // Allow cookies and auth headers
};
app.use(cors(corsOptions)); // Apply CORS settings

// HTTP request logger for debugging and monitoring
app.use(morgan());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from the request headers
app.use(cookieParser());

/* ---------------------------------------------------
   Handle favicon.ico requests to avoid 500 error
   This prevents console error when browser tries
   to load favicon but it's not served by backend
----------------------------------------------------- */
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Main API routes prefix
app.use('/api/v1', router);

// Handle 404 - Route not found
app.use(notFound);

// Global error handling middleware
app.use(errorHandler);

// Start the server and connect to the database
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT} Mode:${process.env.NODE_ENV}`);
    DB_Connect();
});
