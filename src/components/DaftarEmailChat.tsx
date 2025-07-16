// src/components/DaftarEmailChat.tsx

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { setSelectedFriend } from '@/redux/slices/userSlice';
import Loaders from './Loaders';
import socket from '@/socket';
import { NavLink} from 'react-router-dom';
import MessageStatus from './MessageStatus';

interface Users {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  friends?: string[];
  createdAt?: string | null;
}
interface Message {
  id?: string; // ID unik dari dokumen Firestore
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'read' | 'failed'; // Status pesan
}

const ChatItem = ({ friend, currentUser, onSelect, isOnline }: { friend: Users, currentUser: Users, onSelect: (friend: Users) => void, isOnline: boolean }) => {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const room = [currentUser.uid, friend.uid].sort().join('-');
    const messagesCollection = collection(db, 'chats', room, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setLastMessage({ ...doc.data(), id: doc.id } as Message);
      } else {
        setLastMessage(null);
      }
    });

    return () => unsubscribe();
  }, [currentUser, friend.uid]);

  return (
    <div
      onClick={() => onSelect(friend)}
      className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-[#0000001e] cursor-pointer  border-b-[#0000002d] border-b"
    >
      <div className="relative">
        <img src={friend.photoURL || `https-ui-avatars.com/api/?name=${friend.name}`} alt={friend.name} className="w-12 h-12 rounded-full mr-4" referrerPolicy='no-referrer' />
        {/* Indikator Online */}
        {isOnline && (
          <span className="absolute bottom-0 right-4 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        )}
      </div>
      <div className="flex-grow overflow-hidden">
        <h3 className="font-semibold text-black e truncate">{friend.name}</h3>
        <div className="flex items-center text-sm text-gray-500">
          {lastMessage ? (
            <>
              <div className="mr-1">
                <MessageStatus 
                  status={lastMessage.status} 
                  isCurrentUser={lastMessage.senderId === currentUser.uid}
                />
              </div>
              <p className="truncate">
                {lastMessage.senderId === currentUser.uid && "You: "}
                {lastMessage.message}
              </p>
            </>
          ) : (
            <p className="truncate italic">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};



const DaftarEmailChat = () => {
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  // const selectedFriend = useSelector((state: RootState) => state.user.selectedFriend);
  const [friends, setFriends] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
// const [ setOnlineUsers] = useState<string[]>([]);

 useEffect(() => {
    // Mendengarkan update daftar pengguna online dari server
    const handleUpdateOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    
    socket.on('update_online_users', handleUpdateOnlineUsers);

    return () => {
      socket.off('update_online_users', handleUpdateOnlineUsers);
    };
  }, []);;
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

   if (!currentUser) {
    return <><Loaders></Loaders></>; // Atau tampilkan loader
  }

  return (
    <div className="flex w-full h-full flex-col  bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">Chats</h2>    
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
           <div className="p-2 space-y-1">
      {friends.map((friend) => (
      <ChatItem 
          key={friend.uid}
          friend={friend}
          currentUser={currentUser}
          onSelect={handleSelectFriend}
          // 3. Cek apakah teman ini ada di daftar online
          isOnline={onlineUsers.includes(friend.uid)}
        />
      ))}
    </div>
          ) : (
            <div className="flex items-center justify-center p-4">
                <NavLink to={'/find-emails-chat'} className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:ose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
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