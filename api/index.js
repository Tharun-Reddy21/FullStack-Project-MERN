import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.routes.js";

import cookieParser from "cookie-parser";

import path from "path";

const __dirname = path.resolve();

dotenv.config({ quiet: true });

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);


//for deploying to get pathname of project and frontend

app.use(express.static(path.join(__dirname,'/frontend/dist')));

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'frontend','dist','index.html'));
});

//for errors 
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
