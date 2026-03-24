require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const { connectDB, disconnectDB } = require("./config/db");
//TODO: Other required modules
const corsMiddleware = require("./middleware/corsMiddleware");
const studentExample = require("./routes/studentsExample");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const mealPlanningRoutes = require("./routes/mealPlanningRoutes");
const { notFound, errorHandler} = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const PORT = process.env.PORT || 3000;

const app = express();

// connect to database
connectDB();

// (Swagger) http://localhost:3000/api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//TODO: cors Middleware
app.use(corsMiddleware);

//TODO: Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//TODO: logger middleware
app.use(morgan("dev"));

//TODO: Routes
app.use("/api/v1/students", studentExample);
app.use("/api/v1/maintenance", maintenanceRoutes);
app.use("/api/v1/meal-plans", mealPlanningRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);


//TODO:Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


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

//handles SIGINT signal shutdown
process.on("SIGINT", async () => {
    console.log("SIGINT received. Shutting down...");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});