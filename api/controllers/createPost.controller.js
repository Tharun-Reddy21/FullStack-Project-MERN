import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";



export const createPost = async (req, res, next) => {
  if (req.user.role !== "user") {
    return next(errorHandler(403, "You cannot create post"));
  }

  if (!req.body.title) {
    return next(errorHandler(400, "Please provide all the fields"));
  }
  const slug = req.body.title
    .split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    image: req.file ? `/uploads/${req.file.filename}` : "",
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
