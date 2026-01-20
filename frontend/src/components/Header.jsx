import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineMenu } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { signOutSuccess } from '../redux/user/userSlice.js';

import { useSelector,useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const {theme} = useSelector(stste => stste.theme);
  const navigate = useNavigate();

  const handleSignout = async () => {
      try {
        setProfileOpen(false);
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

  return (
    <nav className="bg-blue-800 border-b p-1 font-sans min-w-75">
      <div className="flex items-center justify-between w-full">
        <Link
          to="/"
          className="flex items-center gap-0.5 text-sm sm:text-xl font-bold text-white"
        >
          <span className="bg-violet-900 px-2 pt-1 pb-1.5 text-white rounded-2xl w-fit">
            Blog
          </span>
          Posts
        </Link>

        <form className="hidden md:block">
          <TextInput
            type="text"
            placeholder="search ..."
            className="w-full h-10"
            rightIcon={AiOutlineSearch}/>
        </form>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 font-semibold">
            <Link to="/" className="text-white">
              Home
            </Link>
            <Link to="/about" className="text-white">
              About
            </Link>
            {!currentUser &&
              <Link to="/sign-up" className="text-white">
              Sign Up
            </Link>
            }
            
          </div>
          {/*.................. Theme change Button........................... */}
          <Button
            onClick={()=>dispatch(toggleTheme())}
            className="hidden md:inline-flex w-12 h-8
             transition-transform hover:scale-105 cursor-pointer"
            color="gray"
            pill>
            {theme === 'dark'?<FaMoon /> : <FaSun/>}
            
          </Button>

          
          {showSearch && (
            <div className="md:hidden">
              <TextInput  type="text"  placeholder="search ..."
                className="w-full h-11"/>
            </div>
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-white text-xl">
            <AiOutlineSearch />
          </button>

          {/* Profile icon and content*/}
          {currentUser ? (
            <div className="relative block">
              <img
                src={currentUser.profilePic}
                alt="profile"
                className="w-9 h-9 rounded-full cursor-pointer border"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setOpen(false);
                  }}/>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2
                 w-56 bg-white rounded-md font-sans
                 shadow-lg z-50 text-black ">
                  <div
                    className="px-4 py-4 border-b 
                  flex flex-col justify-center items-center ">
                    <p className="text-xs font-semibold py-1">
                      {currentUser.username}
                    </p>
                    <p
                      className="text-xs text-gray-700 truncate
                     font-semibold py-1 max-w-50">
                      {currentUser.email}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center ">
                    <Link
                      to="/dashboard?tab=profile"
                      className="w-full px-4 py-1 text-md text-center
                       font-semibold hover:bg-gray-300"
                      onClick={() => {
                        setProfileOpen(false);}}>
                      Profile
                    </Link>

                    <button
                      onClick={handleSignout}
                      className="w-full px-4 pb-2 text-md text-center
                        text-red-600 hover:bg-gray-300 font-semibold
                        rounded-md overflow-hidden">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in" className="hidden md:block font-semibold">
              <button className="bg-fuchsia-200 text-blue-950 
              rounded-full w-15 h-8 hover:bg-fuchsia-300 cursor-pointer">
                SignIn
              </button>
            </Link>
          )}

      {/* Small screen hamburger open*/}
          <button
            onClick={() => {
              setOpen(!open);
              setProfileOpen(false);
            }}
            className="md:hidden text-white text-3xl">
            <AiOutlineMenu />
          </button>
        </div>
      </div>

      
      {open && (
        <div className="md:hidden mt-2 font-semibold flex flex-col gap-3 border-t border-blue-600 pt-2 bg-gray-900 items-center">
          <Link to="/" onClick={() => setOpen(false)} className="text-white">
            Home
          </Link>
          <Link  to="/about"
            onClick={() => setOpen(false)}
            className="text-white">
            About
          </Link>
          <Link
            to="/sign-up"
            onClick={() => setOpen(false)}
            className="text-white">
            {!currentUser && "Sign Up"} 
          </Link>
          <Link  to="/sign-in"
            onClick={() => setOpen(false)}
            className="text-white">
            {!currentUser && "Sign In"}
          </Link>
        </div>
      )}
    </nav>
  );
}
