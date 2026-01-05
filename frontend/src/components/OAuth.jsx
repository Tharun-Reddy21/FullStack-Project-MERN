import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth} from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInFail, signInSuccess } from "../redux/user/userSlice.js";

import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOnClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      // console.log(resultFromGoogle);
      const data = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePic: resultFromGoogle.user.photoURL,
        }),
        credentials: "include",
      });
      const result = await data.json();
      if (!data.ok) {
        dispatch(signInFail(result.message));
        return;
      }

      dispatch(signInSuccess(result));
      navigate("/");
      return;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleOnClick}
      type="button"
      className="
        flex items-center justify-center gap-3
        w-full max-w-sm
        px-4 py-2
        font-sans
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold rounded-lg
        transition duration-200 disabled:opacity-60"
    >
      <span>Sign in with Google</span>
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google logo"
        className="h-5 w-5"
      />
    </button>
  );
}
