// src/pages/EmailFriendLists.tsx

import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import {type RootState} from '../redux/store';
import {useSelector} from 'react-redux';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import Loaders from '@/components/Loaders';
// Tipe data untuk setiap orang
import { useDispatch } from "react-redux";
import { setSelectedFriend, clearSelectedFriend } from "@/redux/slices/userSlice";
import { useNavigate } from 'react-router-dom';


interface Users {
uid: string
email: string
name: string
photoURL: string
friends?: string[]
createdAt?: string | null
}


// Komponen Card untuk satu orang
const PersonCard = ({ person, onClick }: { person: Users, onClick: () => void }) => (
    
  <div  onClick={onClick}  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
    <div className="flex items-start justify-between">
      {person.photoURL ? (
        <img src={person.photoURL} alt={person.name} className="h-16 w-16 rounded-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
      )}
      <button className="text-gray-400 hover:text-gray-600">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-gray-800">{person.name}</h3>
      <p className="text-sm text-gray-500">{person.email}</p>
    </div>
   
    <div className="mt-4 border-t pt-4">
    </div>
  </div>
);

// Komponen Utama
const EmailFriendLists = () => {
    const currentUser = useSelector((state: RootState) => state.user.selectedUser);
     const currentFriends = useSelector((state: RootState) => state.user.selectedFriend);

    const curentIdUser = currentUser?.uid;
    const [peopleData, setPeopleData] = useState<Users[]>([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSelectUser = (userId: string) => {
  const selected = peopleData.find((u) => u.uid === userId);
  try {
      if (selected) {
        dispatch(setSelectedFriend(selected));        
        navigate('/yu-chat');
      }
      console.log(selected);
    
  } catch (error) {
    console.error(error);
  }
};
const handleDeleteFriends = () => {
    dispatch(clearSelectedFriend())
}

useEffect(() => {
  const fetchFriends = async () => {
    if (!curentIdUser) return;

    setLoading(true);

    try {
      // 1. Get the current user's document to find their friends list
      const userDocRef = doc(db, 'users', curentIdUser);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const currentUserData = userDocSnap.data();
        const friendUIDs = currentUserData.friends;

        // 2. Check if the user has any friends
        if (friendUIDs && friendUIDs.length > 0) {
          // 3. Create a query to get all friend documents at once
          const friendsQuery = query(collection(db, 'users'), where('__name__', 'in', friendUIDs));
          const friendsSnapshot = await getDocs(friendsQuery);

          const friendUsers = friendsSnapshot.docs.map(document => {
            const data = document.data();
            // 4. Convert the Timestamp to a serializable format (ISO string)
            const createdAt = data.createdAt ? data.createdAt.toDate().toISOString() : null;

            return {
              ...data,
              uid: document.id,
              createdAt: createdAt,
            } as Users; // Make sure your Users interface expects createdAt as string | null
          });

          setPeopleData(friendUsers);
        } else {
          // No friends to display
          setPeopleData([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000); // Reduced timeout for better UX
    }
  };

  fetchFriends();
}, [curentIdUser]);


    

  return (
      <div className="flex h-screen w-full overflow-hidden important bg-gray-100 font-sans">
   <h1>{currentFriends?.name}</h1>
  <h1>{currentFriends?.email}</h1>
  <button  onClick={handleDeleteFriends}>delete friends</button>
        <Sidebar />
      <div className="mx-auto lg:static w-[80%]">
        {/* Header dan Judul */}
        <h1 className="text-4xl font-bold text-gray-900">People</h1>

        {/* Tabs dan Search Bar */}
        <div className="mt-6 flex flex-col items-baseline justify-between md:flex-row">
          <div className="flex border-b">
            <button className="border-b-2 border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600">All</button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800">Organization</button>
          </div>
          <div className="relative mt-4 w-full md:mt-0 md:w-64">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name" className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Filter dan Kontrol Tampilan */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            Design Team <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            Position <ChevronDown className="h-4 w-4" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                All <ChevronDown className="h-4 w-4" />
            </button>
            <div className="flex items-center rounded-lg border bg-white p-1 shadow-sm">
                <button className="rounded-md bg-gray-100 p-1 text-gray-700"><LayoutGrid className="h-5 w-5"/></button>
                <button className="p-1 text-gray-400 hover:text-gray-700"><List className="h-5 w-5"/></button>
            </div>
          </div>
        </div>


{/* RENCANA NYA SAAT CARD PROFIL DIKLIK MAKA AKAN PINDAH KE HALAMAN CHATPAGE DENGAN MENAMPILKAN HASIL DARI TEMAN YANG DI PILIH/KLIK  */}
        {/* Grid Kartu Profil */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Loaders />
          ) : (
            peopleData.map(person => <PersonCard key={person.uid} person={person} onClick={()=> handleSelectUser(person.uid)} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailFriendLists;