import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";

//test route 
export const test=(res)=>{
    res.json({
        message:"Api test response is working"
    })
};

//updating user details to database

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update'));
  }

  const updateFields = {};

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    updateFields.password = await bcryptjs.hash(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(errorHandler(400, 'username must be between 5 and 20 characters'));
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'username must not contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'username must be in lowercase'));
    }
    if (!req.body.username.match(/^[a-z0-9]+$/)) {
      return next(errorHandler(400, 'username must contain only letters and numbers'));
    }

    updateFields.username = req.body.username;
  }

  if (req.body.email) {
    if (req.body.email.length < 5 || req.body.email.length > 20) {
      return next(errorHandler(400, 'email must be between 5 and 20 characters'));
    }
    if (req.body.email.includes(' ')) {
      return next(errorHandler(400, 'email must not contain spaces'));
    }
    if (!req.body.email.includes('@gmail.com')) {
      return next(errorHandler(400, 'email must contain @gmail.com'));
    }
    if (req.body.email !== req.body.email.toLowerCase()) {
      return next(errorHandler(400, 'email must be in lowercase'));
    }

    updateFields.email = req.body.email;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

//delete user from database completely

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.id.toString() !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete'));
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};

//signout user by removing cookie data of user

export const signoutUser = async (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200)
    .json('User has been signed out');
  } catch (error) {
    next(error)
  }

}

