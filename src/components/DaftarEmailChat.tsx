// src/components/DaftarEmailChat.tsx

import React, { useEffect, useState } from 'react';
import { Search, Settings, Plus } from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { setSelectedFriend } from '@/redux/slices/userSlice';
import Loaders from './Loaders';
import socket from '@/socket';
import { NavLink} from 'react-router-dom';
interface Users {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  friends?: string[];
  createdAt?: string | null;
}

const DaftarEmailChat = () => {
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const selectedFriend = useSelector((state: RootState) => state.user.selectedFriend);
  const [friends, setFriends] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

useEffect(() => {
    // Mendengarkan update daftar pengguna online dari server
    const handleUpdateOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    
    socket.on('update_online_users', handleUpdateOnlineUsers);

    // Membersihkan listener saat komponen unmount
    return () => {
      socket.off('update_online_users', handleUpdateOnlineUsers);
    };
  }, []);
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?.uid) return;

      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const currentUserData = userDocSnap.data();
          const friendUIDs = currentUserData.friends;

          if (friendUIDs && friendUIDs.length > 0) {
            const friendsQuery = query(collection(db, 'users'), where('__name__', 'in', friendUIDs));
            const friendsSnapshot = await getDocs(friendsQuery);

            const friendUsers = friendsSnapshot.docs.map(document => {
              const data = document.data();
              const createdAt = data.createdAt ? data.createdAt.toDate().toISOString() : null;
              return { ...data, uid: document.id, createdAt } as Users;
            });

            setFriends(friendUsers);
          }
        }
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser]);

  const handleSelectFriend = (friend: Users) => {
    dispatch(setSelectedFriend(friend));
  };

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">Chats</h2>
        <div className="flex space-x-3">
          <button className="text-gray-500 hover:text-gray-700"><Settings className="h-5 w-5" /></button>
          <button className="text-gray-500 hover:text-gray-700"><Plus className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Daftar Chat */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Loaders />
        ) : (
          friends.length > 0 ? (
            friends.map((friend) => {
              const isOnline = onlineUsers.includes(friend.uid);
              return (
                <div
                  key={friend.uid}
                  className={`flex cursor-pointer items-center p-4 hover:bg-gray-100 ${selectedFriend?.uid === friend.uid ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelectFriend(friend)}
                >
                  {friend.photoURL ? (
                    <img src={friend.photoURL} alt={friend.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                      {friend.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className={`truncate text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                    <p className="truncate text-sm text-gray-500">Pesan terakhir...</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center p-4">
                <NavLink to={'/find-emails-chat'} className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
     Find Friends ..
    </NavLink>
             
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DaftarEmailChat;