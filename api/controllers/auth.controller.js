import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config({ quiet: true });

{/* SIGN UP */}
export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
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
    res.json({ message: "signed up successfully" });
  } catch (err) {
    next(err);
  }
};

{ /* SIGN IN */}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found !!"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Incorrect Password !!"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(validUser);
  } catch (err) {
    next(err);
  }
};

{/* GOOGLE Sign In*/}

export const google = async (req, res, next) => {
  const { name, email, googlePic } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, 
        {expiresIn: "4h"});
      res.status(200)
        .cookie("access_token", token, {httpOnly: true,})
        .json(user);
    } else {
      const genPass = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(genPass, 10);
      const newUser = new User({
        username:name.toLowerCase().split(' ').join('')+
        Math.random().toString(9).slice(-5),
        email,
        password: hashedPassword,
        role:'user',
        profilePic:googlePic
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      res.status(200)
        .cookie("access_token", token, {httpOnly: true,})
        .json(newUser);
    }
  } catch (error) {
    next(err);
  }
};
