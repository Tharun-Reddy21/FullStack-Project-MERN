import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

import cookieParser from "cookie-parser";

dotenv.config({ quiet: true });

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
