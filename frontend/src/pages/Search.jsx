import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/get-posts?${searchQuery}`);

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPosts(data.blogs);
      setLoading(false);
      setShowMore(data.blogs.length > 9);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm===null?'':sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/post/get-posts?${urlParams.toString()}`);

    if (!res.ok) return;

    const data = await res.json();
    setPosts([...posts, ...data.blogs]);
    setShowMore(data.blogs.length > 9);
  };

  return (
    <div className='flex flex-col md:flex-row bg-black text-gray-100'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-700'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold text-gray-200'>
              Search Term :
            </label>
            <input
              className='bg-gray-900 text-gray-100 border border-gray-700 w-30 rounded py-2
              sm:w-fit'
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}/>
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold text-gray-200'>Sort :</label>
            <select
              className='bg-gray-900 text-gray-100 border border-gray-700 rounded pl-3 pr-8 py-2'
              onChange={handleChange}
              value={sidebarData.sort}
              id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold text-gray-200'>Category :</label>
            <select
              className='bg-gray-900 text-gray-100 border border-gray-700 rounded pl-3 pr-8 py-2'
              onChange={handleChange}
              value={sidebarData.category}
              id='category'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='frontend'>Frontend</option>
              <option value='backend'>Backend</option>
              <option value='database'>Database</option>
              <option value='ai'>AI</option>
              <option value='devops'>DevOps</option>
            </select>
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-gray-100 px-4 py-2 rounded hover:bg-blue-600 transition w-fit self-center'
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-2xl font-semibold sm:border-b border-gray-700 p-3 mt-5'>
          Filtered Blogs:
        </h1>

        <div className='p-7 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-400'>No blogs found.</p>
          )}

          {loading && (
            <p className='text-xl text-gray-400'>Loading...</p>
          )}

          {!loading &&
            posts.map((post) => (
              <div
                key={post._id}
                className='max-w-sm w-full mx-auto'>
                <PostCard post={post} />
              </div>
            ))}
        </div>

        {showMore && (
          <button
            onClick={handleShowMore}
            className='text-teal-400 text-lg hover:underline p-7 w-full'>
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
