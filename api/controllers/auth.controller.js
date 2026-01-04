import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

//async because itreads mongo db data
export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  if (!username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });
  try {
    await newUser.save();
    res.json({
      message: "signed up successfully",
    });
  } catch (err) {
    next(err);
  }
};
