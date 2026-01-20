import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';


export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You cannot add this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
    .sort({createdAt: -1,});
    res.status(200).json(comments);
  } 
  catch (error) {next(error);}
}

export const likeComment = async (req,res,next) => {
  try {
    
    const comment  = await Comment.findById(req.params.commentId)
    if(!comment){
      next(errorHandler(404,'Comment not found'));
    }
    const userLiked = comment.likes.indexOf(req.user.id);
    if(userLiked === -1){
      comment.numberOfLikes +=1;
      comment.likes.push(req.user.id);
    }
    else{
      comment.numberOfLikes -=1;
      comment.likes.splice(userLiked,1);
    }
    comment.save();
    res.status(200).json(comment);

  } catch (error) {
    next(error);
  }
}

export const deleteComment = async (req,res,next) => {

  try {

    const comment = await Comment.findById(req.params.commentId);
    if(!comment){  return next(errorHandler(404,'Comment not found'));  }
    
    if (req.user.role !== 'admin' && comment.userId !== req.user.id ) {
      return next(errorHandler(403, 'You cannot delete this comment')); }
    
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('comment has been deleted');

  } catch (error) {
    next(error);
  }

}

//for admin to see all comments

export const getAllComments = async (req, res, next) => {
  if(req.user.role !== 'admin'){
    return next(errorHandler(403, 'You cannot get the comments')); }

  try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = (req.query.sort === "desc" ? -1 : 1) || -1;
      const comments = await Comment.find()
      .sort({createdAt: sortDirection,})
      .skip(startIndex)
      .limit(limit);

      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());

      const lastMonthComments = await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});

      res.status(200).json({comments,totalComments,lastMonthComments});
    } 
      catch(error) {next(error);}

}
