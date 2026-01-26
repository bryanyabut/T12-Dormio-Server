require("dotenv").config();

const express = require("express");
const path = require("path");
const {config} = require("dotenv");
const { connectDB, disconnectDB } = require("./config/db");
//TODO: Other required modules
const errorHandler = require("./middleware/error");

const PORT = process.env.PORT || 3000;

config();
connectDB()

const app = express();

//TODO: Connect to database

//TODO: cors Middleware

//TODO: Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//TODO: logger middleware

//TODO: Routes


//TODO:Error Handling Middleware
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// Handle unhandled promise rejections
process.on("unhandledRejection", async (err) => {
    console.error(`Error: ${err.message}`);
    server.close(async()=>{
        await disconnectDB();
        process.exit(1);
    })
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error(`Error: ${err.message}`);
    await disconnectDB();
    process.exit(1);
});


// Handle SIGTERM signal shutdown (graceful shutdown)
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});