import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getAuth, getRedirectResult } from "firebase/auth";
import { app } from "./firebase";

import { signInSuccess } from "./redux/user/userSlice";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Header from "./components/Header";
import Footer from "./components/Footer";

import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import ShowPost from "./pages/ShowPost";

function OAuthRedirectHandler() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(signInSuccess(data));
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [auth, dispatch, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <OAuthRedirectHandler />

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />

        </Route>
       
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/post/:postSlug" element={<ShowPost />} />
        
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
