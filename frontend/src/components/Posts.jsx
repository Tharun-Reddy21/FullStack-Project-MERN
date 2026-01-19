import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Posts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postTodelete,setPostToDelete] = useState('');
  const [showMore,setShowMore] = useState(true);
  const [postDeleted,setPostDeleted] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.blogs);
          if(data?.blogs?.length<6){
            setShowMore(false);
          }
        } else {
          console.error("API error:", data);
        }
      } catch (error) {
        console.error("Fetching failed:", error);
      }
    };

    fetchPosts();
  }, [currentUser?._id]);

  const handleDeletePost = async () =>{
    setShowModal(false);
    try {
      
      const res = await fetch(`/api/post/delete-post/${postTodelete}/${currentUser._id}`,
        {method: 'DELETE',credentials: "include" });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postTodelete));
          setPostDeleted(true);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleShowMore = async ()=>{
    const startIndex = userPosts.length;
    try {
      
      const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.blogs]);
        if(data.blogs.length<6){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="p-auto sm:p-10 ">
      <h1 className="text-center pb-4 text-2xl font-semibold">Blog posts</h1>
      {postDeleted && <p className="text-red-700 p-2 self-center font-semibold">** Post deleted successfully</p>}

      {currentUser?.role !== "user" && userPosts.length > 0 ? (
        <div className="flex justify-center flex-col overflow-x-auto">
        <table className="p-2.5 w-full border font-sans">
          <thead>
            <tr className="bg-gray-300 text-gray-900 ">
              <th className="border p-2">Date Uploaded</th>
              <th className="border p-2">Blog Image</th>
              <th className="border p-2">Blog Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Delete Blog</th>
            </tr>
          </thead>

          <tbody>
            {userPosts.map((post) => (
              <tr key={post._id} className="text-center">
                <td className="border p-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  <Link to={`/post/${post.slug}`}>
                  <img  src={post.image}  alt={post.title}
                    className="w-24 h-14 object-cover mx-auto rounded md:hover:scale-105"/>
                  </Link>
                  
                </td>

                <td className="border p-2">
                  <Link
                      className='font-medium text-gray-200'
                      to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </td>

                <td className="border p-2">{post.category}</td>

                <td className="border p-2">
                  <button onClick={()=>{
                    setShowModal(true);
                    setPostToDelete(post._id);
                    setPostDeleted(false);
                  }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {
          showMore && <button 
          onClick={handleShowMore}
          className="pt-4.5 font-semibold hover:text-blue-700 text-blue-500">
            show more blogs</button>
        }
        </div>
      ) 
      : (<p>You don’t have any blog posts yet !!</p>) 
    }
    {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white  text-black p-6 rounded-lg w-80 text-center">
                <HiOutlineExclamationCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="mb-6 font-semibold">
                  Are you sure you want to delete this blog post ?
                </p>
                <div className="flex justify-center gap-4 font-semibold">
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 bg-red-600 text-white
                     rounded font-semibold hover:bg-red-800">
                    Yes
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 font-semibold bg-gray-300 rounded
                    hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
    
    </div>
    
  );
}

export default Posts;
