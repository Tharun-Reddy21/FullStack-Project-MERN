import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost, deletePost, getPosts } from '../controllers/createPost.controller.js';
import { uploadImage } from "../utils/uploadImage.js";

const router = express.Router();

router.post('/create-post',verifyUser,uploadImage,createPost);
router.get('/get-posts',getPosts);
router.delete('/delete-post/:postId/:userId',verifyUser,deletePost);


export default router;