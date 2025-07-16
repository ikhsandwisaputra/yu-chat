/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Register.tsx

import { useState } from 'react';
import { auth, db } from "../firebase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
// Impor fungsi getDoc dan serverTimestamp
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, limit, getDocs } from "firebase/firestore"; 
import { HiChatAlt2, HiShieldCheck } from 'react-icons/hi';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
// Pastikan path dan nama action ini sudah benar sesuai file userSlice.ts Anda
import { setSelectedUser } from '../redux/slices/userSlice'; 
import Loaders from '@/components/Loaders';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleOAuthRegister = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      setLoading(true); // Asumsi Anda punya state setLoading
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // --- AWAL DARI LOGIKA BARU YANG LEBIH CERDAS ---

      // 1. Cek dokumen user di Firestore untuk mendapatkan daftar teman
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let friendsList: string[] = [];
      const userExists = userSnap.exists();
      if (userExists) {
        friendsList = userSnap.data()?.friends || [];
      }

      // 2. Cek apakah ada permintaan pertemanan yang masuk
      const requestsRef = collection(db, 'friendRequests');
      const q = query(
        requestsRef,
        where('to', '==', user.uid),
        where('status', '==', 'pending'),
        limit(1) // Kita hanya perlu tahu jika ada minimal satu
      );
      const requestSnapshots = await getDocs(q);
      const hasPendingRequests = !requestSnapshots.empty;

      // 3. Buat atau perbarui dokumen user di database
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        friends: userExists ? friendsList : [],
      }, { merge: true });

      // 4. Dispatch data ke Redux
      if (auth.currentUser) {
        const currentUser = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || "",
          name: auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "",
          photoURL: auth.currentUser.photoURL || "",
          login: true,
          friends: friendsList,
        };
        dispatch(setSelectedUser(currentUser));
      }

      toast.success("Login berhasil! Selamat datang, " + (user.displayName?.split(" ")[0] || "User"));

      // 5. Logika Pengalihan Halaman yang Baru
      if (hasPendingRequests) {
        navigate('/friend-requests'); // PRIORITAS 1: Jika ada request, langsung ke halaman request.
      } else if (friendsList.length > 0) {
        navigate('/yu-chat/my-list-friends'); // PRIORITAS 2: Jika punya teman, ke daftar chat.
      } else {
        navigate('/find-emails-chat'); // PRIORITAS 3: Jika tidak punya teman & request, baru cari teman.
      }

      // --- AKHIR DARI LOGIKA BARU ---

    } catch (error: any) {
      toast.error("Gagal login: " + error.message);
    } finally {
      setLoading(false);
    }
};

  const [toogle, setToogle] = useState(true);

  const handleToogle = () => {
    setToogle(!toogle);
  };

  return (
    // Latar belakang utama dengan warna custom dan posisi relative untuk blob
    <>
   
    
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ebe3f8] p-5 font-sans">
      <div className="absolute -translate-x-1/3 -translate-y-1/4 inset-0 m-auto h-86 w-86   rounded-full bg-gradient-to-br from-[#9c7ad5] to-[#8e4cff]  mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute -translate-x-[60%] inset-0 m-auto h-86 w-86 rounded-full bg-gradient-to-b from-[#0178ff] via-[#00ff40a8] to-[#00ff80] mix-blend-multiply filter blur-3xl animate-pulse animate-delay-400"></div>
      
      {/* Kartu Kaca (Glassmorphism) */}
      <div className="z-10 flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-2xl backdrop-blur-lg">
        
        {/* Kolom Kiri: Informasi & Branding */}
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
                <h3 className="font-semibold text-[#322c86]">Pesan Real-Time</h3>
                <p className="mt-1 text-sm text-[#322c86]">
                  Terhubung secara instan dengan teman dan keluarga tanpa jeda.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#833fce] p-3">
                <HiShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#322c86]">Aman & Pribadi</h3>
                <p className="mt-1 text-sm text-[#322c86]">
                  Privasimu adalah prioritas kami. Semua percakapan terenkripsi.
                </p>
              </div>
            </div>
          </div>

          <p className="z-10 text-xs text-slate-600/70 mt-5">
            &copy; {new Date().getFullYear()} Yu Chat. All Rights Reserved.
          </p>
        </div>

        {/* Kolom Kanan: Form Registrasi / Login */}
        {toogle ? (
        <div className="w-full bg-white rounded-2xl p-6 lg:w-1/2 m-4 flex items-center justify-center flex-col">
           {loading ? (
      <Loaders></Loaders>
    ) : (
<>

          <h2 className="text-2xl font-bold text-gray-800">Buat akun baru</h2>
          <p className="mt-2 text-sm text-gray-700">
            Sudah punya akun?{' '}
            <a onClick={handleToogle} href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
              Masuk di sini
            </a>
          </p>          
          </>
    )}
          
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
               disabled 
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
              disabled            
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
    </>
  );

};

export default Register;