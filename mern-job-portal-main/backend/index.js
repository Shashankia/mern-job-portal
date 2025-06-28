import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnection.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;
// api endpoints

app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
// cloudinary code
cloudinary.config({
  cloud_name: "dkbcfjxhv",
  api_key: "779515296253342",
  api_secret: "7rX4Kda63GM_7PQ9c7gGKrozuXk",
});
app.listen(PORT, () => {
  connectDB();
  console.log(`server is running ${PORT}`);
});
