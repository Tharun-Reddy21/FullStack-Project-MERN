import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost } from '../controllers/createPost.controller.js';
import { uploadImage } from "../utils/uploadImage.js";

const router = express.Router();

router.post('/create-post',verifyUser,uploadImage,createPost);
router.post("/upload-image", uploadImage, (req, res) => {
  res.status(200).json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});


export default router;