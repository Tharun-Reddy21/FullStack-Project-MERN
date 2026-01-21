import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { signInStart,signInSuccess,signInFail } from "../redux/user/userSlice.js";
import {useDispatch,useSelector} from 'react-redux';
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const dispatch =useDispatch();
  const {loading,error:errorMessage} = useSelector(state=>state.user);


  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);


  const lowercaseFields = ["email"];

  const handleOnChange = (event) => {
    const { id, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [id]: lowercaseFields.includes(id) ? value.toLowerCase() : value,
    }));
  };

  async function handleOnSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      email: formData.email?.trim().toLowerCase(),
      
    };

    try {
      dispatch(signInStart());
      const data = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await data.json();

      if (!data.ok) {
        dispatch(signInFail(result.message));
        return;
      }

      //console.log("Sign In success:", result);
      if(data.ok){
        dispatch(signInSuccess(result));
        navigate('/');
      }
    } 
    catch (err) {
        dispatch(signInFail(result.message || "Something went wrong !!"));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center gap-14 p-3 max-w-3xl mx-auto">
        <div className="font-serif pl-14 md:p-3">
          <Link
            to="/"
            className="flex items-center gap-0.5 text-4xl font-bold text-white">
            <span className="bg-violet-900 px-2 pt-1 pb-2.5 rounded-2xl w-fit">
              Blog
            </span>
            Posts
          </Link>
          <p className="text-sm mt-1.5">Blog Posts project using MERN stack</p>
        </div>

        <div className="flex flex-col gap-4">
          <form onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-4 w-full max-w-md">

              <div className="flex items-center gap-4">
                <label
                  htmlFor="email"
                  className="w-24 text-white text-xl font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  onChange={handleOnChange}
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 border border-gray-700 rounded-lg p-2 bg-white text-black"/>
              </div>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="password"
                  className="w-24 text-white text-xl font-semibold">
                  Password
                </label>
                <div className="relative flex-1">
                  <input
                    id="password"
                    onChange={handleOnChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full border-2 border-gray-400
                     rounded-lg p-2 pr-10 bg-white text-black"/>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600">
                    {showPassword ? (
                      <AiOutlineEye size={18} />
                    ) : (
                      <AiOutlineEyeInvisible size={18} />
                    )}
                  </button>
                </div>
              </div>

              

              {errorMessage && 
              (<p className="text-red-500 text-sm">*{errorMessage}</p>)}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-blue-600 hover:bg-blue-700
                 text-white font-semibold py-2 rounded-lg
                  transition duration-200 disabled:opacity-60">
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <OAuth/>
            </div>
          </form>

          <div className="flex justify-center gap-2.5">
            <span>Dont have an account?</span>
            <Link to="/sign-up" className="text-blue-600 font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
