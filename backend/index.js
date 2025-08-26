import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import uploadRoute from "./routes/upload.route.js";
import truckRoute from "./routes/truck.route.js";
import serverless from "serverless-http";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/upload", uploadRoute);
app.use("/api/trucks", truckRoute);


export default serverless(app);