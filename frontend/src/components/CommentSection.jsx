import { useState,useEffect } from 'react';
import { useSelector} from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import ShowComments from './ShowComments';

function CommentSection({postId}) {

    const{currentUser} = useSelector(state=>state.user);
    const [comment,setComment] = useState('');
    const [commentAdded,setCommentAdded] = useState(false);
    const [commentError,setCommentError] = useState(null);
    const [showComments,setShowComments] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {return;}
    try {
      const res = await fetch(`/api/comment/create`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content:comment,
            postId,
            userId: currentUser._id,
          }),
        });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentAdded(true);
        setCommentError(null);
        setShowComments([data,...showComments])
      }
    } catch (error) {
        setCommentError(error.message);
    }
    };

    useEffect(()=>{
        const getcomments= async () =>{
            try {
                const res = await fetch(`/api/comment/get-comments/${postId}`);
                if (res.ok) {
                const data = await res.json();
                setShowComments(data);}
            } catch (error) {console.log(error);}
        };
        getcomments();
    },[postId]);

    useEffect(() => {
       if (commentAdded || commentError) {
           const timer = setTimeout(() => {
             setCommentAdded(false);
             setCommentError(null);
           }, 6000);

           return () => clearTimeout(timer);
       }
       }, [commentAdded, commentError]);


    const handleLike = async (commentId)=>{
        try {
            
            if(!currentUser){
                navigate('/sign-in')
            }
            const res = await fetch(`/api/comment/like-comment/${commentId}`,
                {   method: 'PUT',credentials: 'include',   });
            if (res.ok) {
                const data = await res.json();
                setShowComments(
                    showComments.map((comment) =>
                    comment._id === commentId
                    ? {...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length,}
                    : comment
                ));
            }

        } catch (error) {
            console.log(error);
            
        }
    };
    

  return (
    <div>
        {currentUser ? (
            <div className='flex p-3 max-w-4xl mx-auto w-full items-center  '>
                <p>Signed in as : @</p>
                <Link to={'/dashboard?tab=profile'}>  
                <p className='hover:underline text-sm
                 hover:text-blue-600'> {currentUser.username} </p> </Link>
            </div>
        ) : (<div className='flex gap-2 p-3 max-w-4xl mx-auto w-full
        border-b border-slate-500 '>
                <p>Please sign in to comment !</p>
                <Link to={'/sign-in'}>  
                <p className='hover:underline hover:text-blue-600'> Sign In</p> </Link>
            </div>)
        }
        {currentUser && (
            <form   className="border border-gray-400 rounded-md p-3 max-w-4xl mx-auto my-4 w-full"
                onSubmit={handleSubmit}>
                <textarea   placeholder="Add a comment . . ."  rows={3}
                    onChange={(e)=>setComment(e.target.value)}
                    value={comment}
                    maxLength={200} 
                    className="w-full rounded-md border text-gray-900
                    border-gray-300 p-2 text-sm "/>

                <div className="mt-5 flex items-center justify-center">
                    <button
                      type="submit"
                      className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white 
                       hover:bg-blue-600 ">
                      Add Comment
                    </button>
                </div>

            </form>
            
        )}
        {commentError && <p className='text-red-600 p-2 max-w-4xl mx-auto w-full'>
            *{commentError}</p>}
        {commentAdded && <p className='text-green-500 p-2 max-w-4xl mx-auto w-full'>
            Comment added !!</p>}
        <h1 className='p-3 max-w-4xl mx-auto w-full text-xl font-bold text-gray-300
        border-b border-slate-500 '>Comments - {showComments?.length}</h1>
        {showComments?.length>0 ? (
            showComments.map((comments=>
                <ShowComments key={comments._id}
                comments={comments}
                onLike={handleLike} />
            )
        ))
        :(<p className='p-3 max-w-4xl mx-auto w-full'> No comments yet</p>)}
    </div>
  )
}

export default CommentSection;