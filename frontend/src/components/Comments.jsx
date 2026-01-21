import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function Comments() {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [commentDeleted, setCommentDeleted] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'admin') return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, [currentUser?.role==='admin']);

  //console.log(comments);
  

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try 
    {
        const res = await fetch(`/api/comment/delete-comment/${commentIdToDelete}`,
        {  method: "DELETE",
          credentials: "include",   }
        );
        const data = await res.json();

    if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setCommentDeleted(true);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-auto sm:p-10">
      <h1 className="text-center pb-4 text-2xl font-semibold">
        Blog Comments
      </h1>

      {commentDeleted && (
        <p className="text-red-700 p-2 self-center font-semibold">
          ** Comment deleted successfully
        </p>
      )}

      {currentUser?.role ==='admin' && comments.length > 0 ? (
        <div className="flex justify-center flex-col overflow-x-auto rounded-t-lg">
          <table className="p-2.5 w-full  font-sans ">
            <thead>
              <tr className="bg-gray-300 text-gray-900">
                <th className="border p-2">Date Updated</th>
                <th className="border p-2">Comment</th>
                <th className="border p-2">Likes</th>
                <th className="border p-2">Post ID</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Delete</th>
              </tr>
            </thead>

            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="text-center">
                  <td className="border p-2">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">{comment.content}</td>

                  <td className="border p-2">{comment.numberOfLikes}</td>

                  <td className="border p-2">{comment.postId} </td>

                  <td className="border p-2">{comment.userId}</td>

                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                        setCommentDeleted(false);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="pt-4.5 font-semibold hover:text-blue-700 text-blue-500">
              show more comments
            </button>
          )}

        </div>
      ) : (
        <p>You don’t have any blog comments yet !!</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-80 text-center">
            <HiOutlineExclamationCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="mb-6 font-semibold">
              Are you sure you want to delete this comment ?
            </p>
            <div className="flex justify-center gap-4 font-semibold">
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800">
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Comments;
