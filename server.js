require("dotenv").config();

const express = require("express");
const path = require("path");
//TODO: Other required modules

const PORT = process.env.PORT || 3000;

const app = express();

//TODO: Connect to database

//TODO: cors Middleware

//TODO: Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//TODO: logger middleware

//TODO: Routes


//TODO:Error Handling Middleware


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));