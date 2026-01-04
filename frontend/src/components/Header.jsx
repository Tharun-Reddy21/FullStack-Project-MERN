import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineMenu } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="bg-blue-800 border-b p-1 font-sans  min-w-[300px]">
      
      <div className="flex items-center justify-between w-full">
        <Link
          to="/"
          className="flex items-center gap-0.5 text-sm sm:text-xl font-bold text-white">
          <span className="bg-violet-900 px-2 pt-1 pb-1.5 text-white gap-0.5 rounded-2xl w-fit">Blog</span>
          Posts
        </Link>

        <form className="hidden md:block">
          <TextInput
            type="text"
            placeholder="search ..."
            className="w-full h-10"
            rightIcon={AiOutlineSearch}
            
          />
          
        </form>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 font-semibold">
            <Link to="/" className="text-white ">
              Home
            </Link>
            <Link to="/about" className="text-white ">
              About
            </Link>
            <Link to="/sign-up" className="text-white ">
              Sign Up
            </Link>
          </div>

          <Button
            className="hidden md:inline-flex w-12 h-8 
            transition-transform hover:scale-105"
            color="gray"
            pill
          >
            <FaMoon />
          </Button>

          <Link to="/sign-in" className="hidden md:block">
            <Button className="bg-fuchsia-200 text-blue-950 w-16 h-8
             hover:bg-fuchsia-300 hover:text-black">
              SignIn
            </Button>
          </Link>

          {/*search icon for small screen */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-white text-xl">
            <AiOutlineSearch />
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-xl"
          >
            <AiOutlineMenu />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden mt-2 ">
          <TextInput
            type="text"
            placeholder="search ..."
            className="w-full h-10"
          />
        </div>
      )}

      {open && (
        <div className="md:hidden mt-2 font-semibold flex flex-col gap-3 border-t
         border-blue-600 pt-2 bg-gray-900 items-center">
          <Link to="/" onClick={() => setOpen(false)} className="text-white">
            Home
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className="text-white">
            About
          </Link>
          <Link to="/sign-up" onClick={() => setOpen(false)} className="text-white">
            Sign Up
          </Link>
          <Link to="/sign-in" onClick={() => setOpen(false)} className="text-white">
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}
