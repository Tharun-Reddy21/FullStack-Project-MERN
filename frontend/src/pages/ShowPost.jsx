import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function ShowPost() {
  const { postSlug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setPost(data.blogs[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(()=>{

    try {

      const fetchRecentPosts = async ()=>{
        const res = await fetch('/api/post/get-posts?limit=3');
        const data = await res.json();
        if(res.ok){
          setRecentPosts(data.blogs);
        }
      }
      fetchRecentPosts(); 
      
    } catch (error) {
      console.log(error.message);
      
    }

  },)

  //console.log(post);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading Please wait ...
      </div>
    );
  return (
    <div className="min-h-screen p-3 flex flex-col max-w-6xl mx-auto ">
    <main className=" md:border border-slate-500 my-5">

      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-4xl mx-auto lg:text-4xl">
        {post && post.title} </h1>

      <div className="flex justify-between p-3 border-b border-slate-500 
      mx-auto w-full max-w-4xl text-xs">
        <span>{post && "Posted on : " + new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5">
        <button className="px-4 py-2 mt-2.5 text-xs rounded-full
          p-3 flex flex-col max-w-6xl mx-auto
         bg-gray-300 text-gray-800 hover:bg-gray-600 hover:text-gray-300
         transition-all duration-100 ease-out shadow-gray-300 shadow-sm font-bold">
          {post && post.category}
        </button>
      </Link>

      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 px-3  pb-4 w-full aspect-video object-cover
        border-b border-slate-500 sm:max-w-3xl sm:mx-auto"/>

      <div
        className="p-3 max-w-4xl mx-auto w-full post-content font-sans
         border-b border-slate-500 "
        dangerouslySetInnerHTML={{ __html: post && post.content }}>
      </div>

      <div className=" ">
        <CommentSection postId={post._id}/>
      </div>

    </main>
    <div className="py-2 px-4 flex flex-col justify-center items-center mb-2 text-xl text-gray-300">
      <h2 className="font-bold">Recent blogs</h2>
      <div className="flex gap-12 md:gap-8 pt-5 flex-col sm:justify-evenly sm:flex-row">
        {recentPosts && 
          recentPosts.map((post)=>{
            return <PostCard key={post._id} post={post}/>
          })
        }
      </div>
    </div>
    </div>


  );
}

export default ShowPost;
