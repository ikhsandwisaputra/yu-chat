/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Tes = () => {
  const handleOAuthRegister = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date()
      });

      alert("Register/Login berhasil!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Register/Login</h2>
      <button
        onClick={() => handleOAuthRegister(new GoogleAuthProvider())}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Daftar dengan Google
      </button>
      <button
        onClick={() => handleOAuthRegister(new GithubAuthProvider())}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Daftar dengan GitHub
      </button>
    </div>
  );
};

export default Tes;
