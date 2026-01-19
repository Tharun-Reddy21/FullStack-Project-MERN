import { useEffect, useState } from "react"
import moment from 'moment';

function ShowComments({comments}) {

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
    </div>
  )
}

export default ShowComments;