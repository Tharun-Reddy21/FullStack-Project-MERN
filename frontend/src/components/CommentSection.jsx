import { useState } from 'react';
import { useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

function CommentSection({postId}) {

    const{currentUser} = useSelector(state=>state.user);
    const [comment,setComment] = useState('');
    const [commentError,setCommentError] = useState(null);

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
        setCommentError(null);
      }
    } catch (error) {
        setCommentError(error.message);
    }
    };

  return (
    <div>
        {currentUser ? (
            <div className='flex p-3 max-w-4xl mx-auto w-full items-center 
            border-b border-slate-500 '>
                <p>Signed in as : @</p>
                <Link to={'/dashboard?tab=profile'}>  
                <p className='hover:underline text-sm
                 hover:text-blue-600'> {currentUser.username} </p> </Link>
            </div>
        ) : (<div className='flex gap-2 p-3 max-w-4xl mx-auto w-full
        border-b border-slate-500 '>
                <p>Please login to comment !</p>
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
        {commentError && <p className='text-red-600 p-3 max-w-4xl mx-auto w-full'>
            *{commentError}</p>}
    </div>
  )
}

export default CommentSection;