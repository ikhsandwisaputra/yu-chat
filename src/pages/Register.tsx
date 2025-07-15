/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Register.tsx

import React, { useState } from 'react';
import { auth, db } from "../firebase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {  HiChatAlt2, HiShieldCheck } from 'react-icons/hi';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
// import { Dispatch } from '@reduxjs/toolkit';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@/redux/slices/userSlice';
 import { serverTimestamp } from "firebase/firestore";
const Register = () => {
  const navigate= useNavigate();
  const dispatch = useDispatch();
  const handleOAuthRegister = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    }, { merge: true });

    toast.success("Login berhasil! Selamat datang, " + (user.displayName?.split(" ")[0] || "User"), {
      position: "top-right",
      autoClose: 5000,
    });

if (auth.currentUser) {
  const currentUser = {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email || "",
    name: auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "",
    photoURL: auth.currentUser.photoURL || "",
    login: true,
    
  };
  dispatch(setSelectedUser(currentUser));
}



    navigate("/yu-chat");

  } catch (error: any) {
    toast.error("Gagal login: " + error.message, {
      position: "top-right",
      autoClose: 5000,
    });
  }
};
const [toogle, setToogle] = useState(true);

const handleToogle = () => {
  setToogle(!toogle);
};

  return (
    // Latar belakang utama dengan warna custom dan posisi relative untuk blob
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ebe3f8] p-5 font-sans">
      <div className="absolute -translate-x-1/3 -translate-y-1/4 inset-0 m-auto h-86 w-86  rounded-full bg-gradient-to-br from-[#9c7ad5] to-[#8e4cff]  mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute -translate-x-[60%] inset-0 m-auto h-86 w-86 rounded-full bg-gradient-to-b from-[#0178ff] via-[#00ff40a8] to-[#00ff80] mix-blend-multiply filter blur-3xl "></div>
      
      {/* Blob Gradient Abstrak di Latar Belakang */}

      {/* Kartu Kaca (Glassmorphism) */}
      <div className="z-10 flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-2xl backdrop-blur-lg">
        
        {/* Kolom Kiri: Informasi & Branding (sekarang transparan) */}
        <div className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex mb-6">
          <div className="z-10 mb-8">
            <h1 className=" text-4xl font-bold tracking-tight text-[#322c86]">
              Yu Chat
            </h1>
            <p className="text-[#322c86]">Bergabung dan mulai percakapanmu.</p>
          </div>

          <div className="z-10 space-y-8">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#833fce] p-3">
                <HiChatAlt2  className="h-6 w-6 text-[white]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Pesan Real-Time</h3>
                <p className="mt-1 text-sm text-white">
                  Terhubung secara instan dengan teman dan keluarga tanpa jeda.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#833fce] p-3">
                <HiShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Aman & Pribadi</h3>
                <p className="mt-1 text-sm text-white">
                  Privasimu adalah prioritas kami. Semua percakapan terenkripsi.
                </p>
              </div>
            </div>
          </div>

          <p className="z-10 text-xs text-slate-600/70">
            &copy; {new Date().getFullYear()} Yu Chat. All Rights Reserved.
          </p>
        </div>

        {/* Kolom Kanan: Form Registrasi */}
        {toogle ? (
        <div className="w-full bg-white rounded-2xl p-6 lg:w-1/2 m-4 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-bold text-gray-800">Buat akun baru</h2>
          <p className="mt-2 text-sm text-gray-700">
            Sudah punya akun?{' '}
            <a onClick={handleToogle} href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
              Masuk di sini
            </a>
          </p>         
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
         
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300/70 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-black/10 cursor-pointer"
               onClick={() => handleOAuthRegister(new GoogleAuthProvider())}
            >
              <FaGoogle className="h-5 w-5" />
              <span>Google</span>
            </button>
               <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300/70 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-black/10 cursor-pointer"
            >
              <FaGithub className="h-5 w-5" />
              <span>GitHub</span>
            </button>
          </div>
        </div>
            
        ) : (             
        <div className="w-full bg-white rounded-2xl p-6 lg:w-1/2 m-4 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-bold text-gray-800">Login Ke Akun Anda</h2>
          <p className="mt-2 text-sm text-gray-700">
            Belum punya akun?{' '}
            <a onClick={handleToogle} href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
              Daftar di sini
            </a>
          </p>
              
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
            <button
              type="button"

              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300/70 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-black/10 cursor-pointer"
               onClick={() => handleOAuthRegister(new GoogleAuthProvider())}
            >
              <FaGoogle className="h-5 w-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300/70 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-black/10 cursor-pointer"
            >
              <FaGithub className="h-5 w-5" />
              <span>GitHub</span>
            </button>
            
          </div>
        </div>
        )}
       
      </div>
       
    </div>
  );
};

export default Register;