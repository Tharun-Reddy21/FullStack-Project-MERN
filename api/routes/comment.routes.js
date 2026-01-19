import express from 'express';
import {  verifyUser } from '../utils/verifyUser.js';
import {createComment, getComments, likeComment} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/get-comments/:postId', getComments);
router.put('/like-comment/:commentId',verifyUser, likeComment);
export default router;