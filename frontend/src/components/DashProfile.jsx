import { useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import {updateStart,updateSuccess,updateFail, signOutSuccess} from "../redux/user/userSlice.js";
import { deleteUserStart,deleteUserSuccess,deleteUserFail } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function DashProfile() {

  const { currentUser, error, loading } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("* No changes made");
      return;
    }

    try {
      dispatch(updateStart());
      const data = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await data.json();

      if (!data.ok) {
        dispatch(updateFail(result.message));
      } else {
        dispatch(updateSuccess(result));
        setUpdateUserSuccess("* User details updated succesfully");
      }
    } catch (err) {
      dispatch(updateFail(err.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {

      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",});
        const data = await res.json();
      if (!res.ok){
        dispatch(deleteUserFail(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (err) {
        dispatch(deleteUserFail(err.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok){console.log(data.message);}
      else{
        dispatch(signOutSuccess(data));
        navigate("/sign-in");
      }
      
    } catch (err) {
      console.log(err.message);
    }
  };

  //use effect for removing the update or error message after updating user details
  useEffect(() => {
    if (updateUserSuccess) {
      setUpdateUserError(null);

      const timer = setTimeout(() => {
        setUpdateUserSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateUserSuccess]);

  useEffect(() => {
    if (updateUserError) {
      setUpdateUserSuccess(null);

      const timer = setTimeout(() => {
        setUpdateUserError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateUserError]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(updateFail(null));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full font-sans">
      <h1 className="my-7 text-center font-bold text-3xl">Profile</h1>

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
          type="text"
          onChange={handleChange}
          placeholder="New password"
          className="border  bg-gray-100 text-gray-950 rounded-md px-3 py-2 w-full"/>

        <button
          disabled={loading}
          className="border rounded-md py-2 font-semibold text-gray-100
          bg-blue-600 hover:bg-blue-700 cursor-pointer">
          {loading ? "Updating ..." : "Update"}
        </button>

        {currentUser.role && (
          <Link to="/create-post">
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-2 font-semibold
              border rounded-md  hover:bg-blue-700 cursor-pointer">
              Create a post
            </button>
          </Link>
        )}
      </form>

      <div className="flex justify-between text-red-600 mt-5 ">
        <button onClick={() => setShowModal(true)}
            className="bg-gray-300 rounded-sm font-semibold px-2 w-fit 
            hover:bg-white border-red-800 border cursor-pointer">
              Delete Account</button>
        <button onClick={() => setShowSignoutModal(true)}
            className="bg-gray-300 rounded-sm font-semibold  px-2 w-fit
            hover:bg-white  border-red-800 border cursor-pointer">
              Sign Out</button>
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
            <p className="mb-6 font-semibold">
              Are you sure you want to delete your account ?
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

      {showSignoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white  text-black p-6 rounded-lg w-80 text-center">
            <HiOutlineExclamationCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="mb-6 font-semibold">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-center gap-4 font-semibold">
              <button
                onClick={() => {
                  setShowSignoutModal(false);
                  handleSignout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold
                hover:bg-red-800">
                Yes
              </button>
              <button
                onClick={() => setShowSignoutModal(false)}
                className="px-4 py-2 font-semibold bg-gray-300 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
