import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/post/get-posts?limit=9');
      const data = await res.json();
      setBlogs(data.blogs || data.posts || []);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen max-w-6xl mx-auto ">
      <h1 className="text-4xl font-semibold px-2.5 py-5 text-gray-300">
        Welcome to Blog posts Homepage
      </h1>

      <p className="py-2.5 px-5 text-sm">
        You can browse different category blogs created by many users here
      </p>

      <Link
        to="/search"
        className="py-2.5 px-5 text-blue-500 hover:text-blue-600 text-sm">
        View all blogs
      </Link>

      <h3 className="text-xl font-semibold px-4 pt-5 pb-10 text-gray-300">
        Recent Blogs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  px-5">
		      {blogs.length > 0 ? (
            blogs.map((blog) => (
              <PostCard key={blog._id || blog.id} post={blog} />
            ))
          ) : (
            <p className="text-gray-400 px-4 col-span-full">
              No blogs found.
            </p>
		      )}
	    </div>
      <Link to="/search"
        className="flex mx-auto my-5 py-1.5 px-3 w-fit justify-center rounded-lg ring-1 ring-blue-500
             text-blue-500 hover:bg-blue-500 hover:text-gray-200 transition">
          View all blogs
      </Link>





    </div>
  );
}
