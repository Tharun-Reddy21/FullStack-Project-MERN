import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
         ...formData,
          [e.target.id]: e.target.value
         });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setUpdateUserError(data.message);
      } else {
        setUpdateUserSuccess('Profile updated successfully');
      }
    }
     catch (err) {
      setUpdateUserError(err.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {navigate('/sign-in');}
    } 
    catch (err) {console.log(err.message);}
  };

  const handleSignout = async () => {
    try {
      await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/sign-in');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full font-sans">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder="Username"
          className="border rounded-md px-3 py-2 w-full bg-gray-100 text-gray-950"/>

        <input
          id="email"
          type="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder="Email"
          className="border  bg-gray-100 text-gray-950 rounded-md px-3 py-2 w-full"/>

        <input
          id="password"
          type="password"
          onChange={handleChange}
          placeholder="New password"
          className="border  bg-gray-100 text-gray-950 rounded-md px-3 py-2 w-full"/>

        <button
          disabled={loading}
          className="border rounded-md py-2 font-semibold text-gray-100
          bg-blue-600 hover:bg-blue-700 ">
          {loading ? 'Updating...' : 'Update'}
        </button>

        {currentUser.role && (
          <Link to="/create-post">
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-2 font-semibold
              border rounded-md hover:opacity-90  hover:bg-blue-700">
              Create a post
            </button>
          </Link>
        )}
      </form>

      <div className="flex justify-between text-red-600 mt-5">
        <button onClick={() => setShowModal(true)}>Delete Account</button>
        <button onClick={handleSignout}>Sign Out</button>
      </div>

      {updateUserSuccess && (
        <p className="text-green-600 mt-4">{updateUserSuccess}</p>
      )}
      {updateUserError && (
        <p className="text-red-600 mt-4">{updateUserError}</p>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white  text-black p-6 rounded-lg w-80 text-center">
            <HiOutlineExclamationCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="mb-6">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded">
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
