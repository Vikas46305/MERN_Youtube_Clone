import { configDotenv } from "dotenv";
configDotenv();
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

const App = express();

import route from "./routes/routes.js";
// DataBase Connection
import DataBaseConnection from "./database/Connection.js";
DataBaseConnection();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cookieParser());
App.use(cors());

// Middlewares
App.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./tmp/",
    })
);

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CloudinaryName,
    api_key: process.env.CloudinaryApiKey,
    api_secret: process.env.CloudinarySecrate,
});

App.use("/", route);

App.listen(process.env.port, () => {
    console.log(`Express is running on port ${process.env.port}`);
});
