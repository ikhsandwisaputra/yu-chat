// src/components/FindEmailsChat.tsx
import React, { useState } from 'react';
import { ArrowRight, MessageCircleHeart, UserPlus } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaRegSadCry } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { type RootState } from '@/redux/store';

interface UserResult {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  friends?: string[];
}

const FindEmailsChat = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    if (!currentUser) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    setHasSearched(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() } as UserResult))
        .filter(user => user.uid !== currentUser.uid);

      setResults(users);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Terjadi kesalahan saat mencari.");
    }
  };

  const handleAddFriend = async (friendUID: string) => {
    if (!currentUser?.login) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const currentData = userSnap.data();
      const currentFriends: string[] = currentData?.friends || [];

      if (currentFriends.includes(friendUID)) {
        toast.warning('Sudah jadi teman!');
        return;
      }

      await updateDoc(userRef, {
        friends: [...currentFriends, friendUID],
      });

      toast.success('Teman berhasil ditambahkan!');
    } catch (error) {
      toast.error("Gagal menambahkan teman.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#d6d4e1] p-4 font-sans">
       
      <h1>{currentUser?.uid}</h1>
      <h1>{currentUser?.name}</h1>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br to-[#9b51fc] shadow-lg">
        <MessageCircleHeart className="h-8 w-8 text-white" />
      </div>

      <h1 className="mb-6 text-xl font-semibold text-slate-700">Temukan Email Temanmu</h1>

      <div className="w-full max-w-md rounded-2xl bg-white/70 p-2 shadow-2xl backdrop-blur-md">
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ketik nama atau departemen..."
            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-4 pl-5 pr-16 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            aria-label="Cari"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#12e2a4] p-2 text-white transition hover:bg-slate-900"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {hasSearched && results.length === 0 && (
            <li className="flex items-center justify-center space-x-2 text-sm text-slate-500">
              <FaRegSadCry className="h-5 w-5" />
              <p>Maaf, sepertinya email temanmu belum mendaftar nihh</p>
            </li>
          )}

          {results.map((user) => (
            <li
              key={user.uid}
              className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-medium text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddFriend(user.uid)}
                className="rounded-full bg-[#12e2a4] p-2 text-white hover:bg-slate-900"
              >
                <UserPlus size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FindEmailsChat;
