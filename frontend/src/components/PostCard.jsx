import { Link } from "react-router-dom";


function PostCard({post}) {
  return (
    <div className="group sm:h-100 overflow-hidden">
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt={post.title} 
            className="h-auto md:h-45 w-full object-cover group-hover:scale-95 transition-all 
            duration-300 z-20 rounded"/>
        </Link>
        <div className="bg-blue-800 rounded-md">
            <p className="font-serif overflow-hidden p-2">{post.title}</p>
            <div className="flex justify-around py-2">
            <span className="font-mono text-sm bg-gray-600 overflow-auto
             rounded-full p-1">{post.category==='undefined'? 'uncategorised' : post.category}</span>
            <Link className="text-sm font-semibold transition-all ease-in
             hover:text-gray-950 " to={`/post/${post.slug}`}>Read blog ...</Link>
            </div>
                
        </div>
    </div>
  )
}

export default PostCard