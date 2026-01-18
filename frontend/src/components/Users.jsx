import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function Users() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdTodelete,setUserIdToDelete] = useState('');
  const [showMore,setShowMore] = useState(true);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/get-users`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          if(data?.users?.length<6){
            setShowMore(false);
          }
        } else {
          console.error("API error:", data);
        }
      } catch (error) {
        console.error("Fetching failed:", error);
      }
    };
    if(currentUser.role==='admin') {fetchUsers();}
  }, [currentUser?._id]);

  const handleDeleteUser = async () =>{
    setShowModal(false);
    try {
      
      const res = await fetch(`/api/user/delete-user/${userIdTodelete}/${currentUser._id}`,
        {method: 'DELETE',credentials: "include" });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postTodelete));
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleShowMore = async ()=>{
    const startIndex = users.length;
    try {
      
      const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUsers((prev)=>[...prev,...data.users]);
        if(data.users.length<6){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="p-auto sm:p-10 overflow-x-auto">
      <h1 className="text-center pb-3.5 text-2xl font-semibold">Users Registered</h1>

      {currentUser?.role !== "user" && users.length > 0 ? (
        <div className="flex justify-center flex-col overflow-x-auto">
        <table className="p-2.5 w-full border font-sans">
          <thead>
            <tr className="bg-gray-300 text-gray-900">
              <th className="border p-2">Date created</th>
              <th className="border p-2">User image</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Delete User</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  <img  src={user.profilePic}  alt={user.username}
                    className="w-14 h-14 object-cover mx-auto rounded-full"/>
                </td>

                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>

                <td className="border p-2">{user.role}</td>

                <td className="border p-2">
                  <button onClick={()=>{
                    setShowModal(true);
                    setUserIdToDelete(user._id);
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
            show more users</button>
        }
        </div>
      ) 
      : (<p>You don’t have any users yet !!</p>) 
    }
    {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white  text-black p-6 rounded-lg w-80 text-center">
                <HiOutlineExclamationCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="mb-6 font-semibold">
                  Are you sure you want to delete this user ?
                </p>
                <div className="flex justify-center gap-4 font-semibold">
                  <button
                    onClick={handleDeleteUser}
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

export default Users;
