import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/ConnectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoutes.js';
import postRoutes from "./Routes/postRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from './socket/socket.js';
import path from 'path';
import job from './cron/cron.js';

dotenv.config();
connectDB();
job.start();



const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // react app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => console.log(`Server started on ${PORT}`));