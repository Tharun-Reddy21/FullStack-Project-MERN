import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fullstack-mern-8da56.firebaseapp.com",
  projectId: "fullstack-mern-8da56",
  storageBucket: "fullstack-mern-8da56.appspot.com",
  messagingSenderId: "939300755204",
  appId: "1:939300755204:web:53f3634212ce1d87296251",
};

export const app = initializeApp(firebaseConfig);
