import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

function DataBaseConnection() {
    try {
        mongoose
            .connect(process.env.mongoUrl)
            .then(() => {
                console.log("Database connected success");
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
}

export default DataBaseConnection;