require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB, disconnectDB } = require("./config/db");
//TODO: Other required modules
const studentExample = require("./routes/studentsExample");
const { notFound, errorHandler} = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 3000;

const app = express();

// connect to database
connectDB();

//TODO: cors Middleware

//TODO: Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//TODO: logger middleware

//TODO: Routes
app.use("/api/v1/students", studentExample);


//TODO:Error Handling Middleware
app.use(notFound);
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