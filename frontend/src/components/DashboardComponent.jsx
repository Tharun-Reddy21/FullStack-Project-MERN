import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiAnnotation, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';


function DashboardComponent() {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const [userIndex, setUserIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [commentIndex, setCommentIndex] = useState(0);

  const LIMIT = 5;
  const COMMENT_LIMIT = 8;

  useEffect(() => {
    if (currentUser?.role !== "admin") return;

    fetchUsers(true);
    fetchPosts(true);
    fetchComments(true);
  }, [currentUser]);

  const fetchUsers = async (initial = false) => {
    const startIndex = initial ? 0 : userIndex;
    const res = await fetch(
      `/api/user/get-users?limit=${LIMIT}&startIndex=${startIndex}`,
      { credentials: "include" }
    );
    const data = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        initial ? data.users : [...prev, ...data.users]
      );
      setTotalUsers(data.totalUsers);
      setLastMonthUsers(data.lastMonthUsers);
      setUserIndex(startIndex + LIMIT);
    }
  };

  const fetchPosts = async (initial = false) => {
    const startIndex = initial ? 0 : postIndex;
    const res = await fetch(
      `/api/post/get-posts?limit=${LIMIT}&startIndex=${startIndex}`,
      { credentials: "include" }
    );
    const data = await res.json();

    if (res.ok) {
      setPosts((prev) =>
        initial ? data.blogs : [...prev, ...data.blogs]
      );
      setTotalPosts(data.totalPosts);
      setLastMonthPosts(data.lastMonthPosts);
      setPostIndex(startIndex + LIMIT);
    }
  };

  const fetchComments = async (initial = false) => {
    const startIndex = initial ? 0 : commentIndex;
    const res = await fetch(
      `/api/comment/get-comments?limit=${COMMENT_LIMIT}&sort=desc&startIndex=${startIndex}`,
      { credentials: "include" }
    );
    const data = await res.json();

    if (res.ok) {
      setComments((prev) =>
        initial ? data.comments : [...prev, ...data.comments]
      );
      setTotalComments(data.totalComments);
      setLastMonthComments(data.lastMonthComments);
      setCommentIndex(startIndex + COMMENT_LIMIT);
    }
  };

  return (
    <div className="px-6 py-6 space-y-12 max-w-full min-w-0">

      {/* {users} */}
      <section>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2.5">Recent Users <HiOutlineUserGroup /></h2>

        <TableWrapper>
          <UsersTable users={users} />
        </TableWrapper>

        <FooterStats
          label="Users"
          total={totalUsers}
          lastMonth={lastMonthUsers}
          onShowMore={() => fetchUsers()}
          canShowMore={users.length < totalUsers}/>

      </section>

      {/* {posts} */}
      <section>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2.5">
          Recent Posts <HiDocumentText/></h2>

        <TableWrapper>
          <PostsTable posts={posts} />
        </TableWrapper>

        <FooterStats
          label="Posts"
          total={totalPosts}
          lastMonth={lastMonthPosts}
          onShowMore={() => fetchPosts()}
          canShowMore={posts.length < totalPosts}/>

      </section>

      {/* {comments} */}
      <section>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2.5
        ">Recent Comments <HiAnnotation /></h2>

        <TableWrapper>
          <CommentsTable comments={comments} />
        </TableWrapper>

        <FooterStats
          label="Comments"
          total={totalComments}
          lastMonth={lastMonthComments}
          onShowMore={() => fetchComments()}
          canShowMore={comments.length < totalComments}/>

      </section>

    </div>
  );
}

// {for show more}

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto rounded-t-lg">
    {children}
  </div>
);

const FooterStats = ({ label, total, lastMonth, onShowMore, canShowMore }) => (
  <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
    <span>
      Total {label}: {total} · Last month {label}: {lastMonth}
    </span>

    {canShowMore && (
      <button
        onClick={onShowMore}
        className="text-blue-500 hover:text-blue-700 font-semibold">
        {`Show more ${label}`}
      </button>
    )}
  </div>
);

const UsersTable = ({ users }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-300 text-gray-900">
        <th className="border p-2">Username</th>
        <th className="border p-2">Email</th>
        <th className="border p-2">Role</th>
        <th className="border p-2">Registered on</th>
      </tr>
    </thead>
    <tbody>
      {users.map((u) => (
        <tr key={u._id} className="text-center">
          <td className="border p-2">{u.username}</td>
          <td className="border p-2 break-all">{u.email}</td>
          <td className="border p-2">{u.role}</td>
          <td className="border p-2">
            {new Date(u.createdAt).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PostsTable = ({ posts }) => (
  <table className="w-full">
    <thead>
      <tr className="bg-gray-300 text-gray-900">
        <th className="border p-2">Image</th>
        <th className="border p-2">Title</th>
        <th className="border p-2">User Id</th>
        <th className="border p-2">Created on</th>
      </tr>
    </thead>
    <tbody>
      {posts.map((p) => (
        <tr key={p._id} className="text-center">
          <td className="border p-2">
            <img src={p.image} alt="" className="h-16 mx-auto" />
          </td>
          <td className="border p-2 font-semibold">{p.title}</td>
          <td className="border p-2 text-xs">{p.userId}</td>
          <td className="border p-2">
            {new Date(p.createdAt).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const CommentsTable = ({ comments }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-300 text-gray-900">
        <th className="border p-2">Date</th>
        <th className="border p-2">Comment</th>
        <th className="border p-2">Likes</th>
        <th className="border p-2">Post Id</th>
        <th className="border p-2">User Id</th>
      </tr>
    </thead>
    <tbody>
      {comments.map((c) => (
        <tr key={c._id} className="text-center">
          <td className="border p-2">
            {new Date(c.updatedAt).toLocaleDateString()}
          </td>
          <td className="border p-2 text-left">
            <div className="max-w-sm min-w-0 break-all whitespace-normal">
              {c.content}
            </div>
          </td>
          <td className="border p-2">{c.numberOfLikes}</td>
          <td className="border p-2 text-xs">{c.postId}</td>
          <td className="border p-2 text-xs">{c.userId}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default DashboardComponent;
