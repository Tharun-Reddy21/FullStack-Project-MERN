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
      category: req.body.category || "uncategorised",
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


export const getPosts = async (req, res, next) => {

  try {
 
    const startIndex = Math.max(parseInt(req.query.startIndex) || 0, 0);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 50);
    const sortOrder = req.query.sort === 'desc'? -1 : 1;

    const blogs = await Post.find({
      ...(req.query.userId && {userId : req.query.userId}),
      ...(req.query.category && {category : req.query.category}),
      ...(req.query.slug && {slug : req.query.slug}),
      ...(req.query.postId && {_id : req.query.postId}),
      ...(req.query.searchTerm && {
        $or : [
          {title: {$regex: req.query.searchTerm,$options: 'i'}},
          {content: {$regex: req.query.searchTerm,$options: 'i'}},
        ]
      }),
    }).sort({updatedAt:sortOrder}).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate() );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },  });

    res.status(200).json({
      blogs,
      totalPosts,
      lastMonthPosts,  });
    
  } catch (error) {
    next(error);
  }

}

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, 'You are not authorised'));
    }

    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You cannot delete this post')); }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'The post has been deleted successfully',
    });
    
  } catch (error) {
    next(error);
  }
};


