import { useEffect, useState } from "react"
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";


function ShowComments({comments,onLike}) {
  const {currentUser} = useSelector(state=>state.user);
  const [user,setUser] = useState({});

  useEffect(()=>{
    const getUser = async () =>{
      try {
        
        const res = await fetch(`/api/user/${comments.userId}`);
        const data = await res.json();
        if(res.ok){
          setUser(data);
        }

      } catch (error) {
        
      }
    };
    getUser();
  },[comments])
  return (
    <div className='p-4 max-w-4xl mx-auto w-full text-gray-300 border-b border-slate-500'>
      <div className="flex gap-2 items-center ">
        <img className="w-8 h-8 rounded-full" src={user.profilePic} alt={user.username} />
        <p className="font-semibold pr-5">{user ? `@${user.username}` : 'Anonymous user'}</p>
        <p className="text-gray-400 text-sm">{moment(comments.createdAt).fromNow()}</p>
      </div>
      <div className='py-1 px-10 text-gray-300 '>
        <p>{comments.content}</p>
      </div>
      <div className={`flex gap-1 text-sm text-gray-500 font-light hover:text-blue-600 
      items-center py-1 px-10 ${
        currentUser && comments.likes.includes(currentUser._id) && 'text-blue-600!'} `}>
        <p className="text-gray-300 pr-2"> {comments.numberOfLikes}</p>
        <FaThumbsUp/>
          <button onClick={()=>onLike(comments._id)}
            className="cursor-pointer">
            {currentUser && comments.likes.includes(currentUser._id) ? 'Liked' : 'Like' }
          </button>
          
      </div>
    </div>
  )
}

export default ShowComments;