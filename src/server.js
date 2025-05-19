import express from "express";
import { config } from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import DB_Connect from "./config/DB_Connect.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";


// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1',router)

// Middleware to handle 404 - Not Found
app.use(notFound);
// General error handling middleware
app.use(errorHandler);


app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await DB_Connect(); // Ensure DB connection on startup
});
