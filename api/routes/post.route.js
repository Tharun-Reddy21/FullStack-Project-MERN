import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost } from '../controllers/createPost.controller.js';
import { uploadImage } from "../utils/uploadImage.js";

const router = express.Router();

router.post('/create-post',verifyUser,uploadImage,createPost);


export default router;