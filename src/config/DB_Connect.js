import { connect } from "mongoose";
import asyncHandler from "express-async-handler";

const DB_Connect = asyncHandler(async () => {
    try {
        await connect(process.env.DB_URL);
        console.log("<<< DB Connected >>>");
    } catch (error) {
        // Log the error and exit the process
        console.error(`Error in DB Connect: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
});

export default DB_Connect;
