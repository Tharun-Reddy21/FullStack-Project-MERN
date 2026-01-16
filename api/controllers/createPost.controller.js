import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

export const createPost = async (req, res, next) => {
  if (req.user.role === "user") {
    return next(errorHandler(403, "You cannot create post"));
  }

  if (!req.body.title) {
    return next(errorHandler(400, "Please provide all the fields"));
  }

  if (!req.file) {
    return next(errorHandler(400, "Image is required"));
  }

  const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");

  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "posts"
    );

    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      image: result.secure_url,
      slug,
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
