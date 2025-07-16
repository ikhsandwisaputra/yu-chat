// src/components/Chat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Phone, Video, Info, Image, Smile, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import socket from '../socket';
import { useDispatch } from 'react-redux';
import { clearSelectedFriend } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc,
  doc
} from 'firebase/firestore';
import {db} from '@/firebase'
import SendButton from './Button';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

interface Friend {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}


interface Message {
  id?: string; // ID unik dari dokumen Firestore
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'read' | 'failed'; // Status pesan
}
interface ChatProps {
  friend: Friend;
  onToggleProfile: () => void;
}

const MessageStatus = ({ status, isCurrentUser }: { status: Message['status'], isCurrentUser: boolean }) => {
  if (!isCurrentUser) return null; // Hanya tampilkan status untuk pesan kita

  switch (status) {
    case 'sending':
      return <span title="Mengirim...">🕒</span>; // Ikon jam
    case 'sent':
      return <span title="Terkirim">✓</span>; // Centang satu
    case 'read':
      return <span title="Dibaca" style={{ color: '#53bdeb' }}>✓✓</span>; // Centang dua biru
    case 'failed':
      return <span title="Gagal terkirim">❗</span>; // Ikon seru
    default:
      return null;
  }
};

const Chat = ({ friend, onToggleProfile }: ChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [isFriendOnline, setIsFriendOnline] = useState(false); 
  const room = [currentUser?.uid, friend.uid].sort().join('-');

const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const [toogle, setToogle] = useState(false);

const handleToogle = () => {
  setToogle(!toogle);
}
useEffect(() => {
    const handleFriendTyping = () => setIsTyping(true);
    const handleFriendStoppedTyping = () => setIsTyping(false);

    socket.on('friend_is_typing', handleFriendTyping);
    socket.on('friend_stopped_typing', handleFriendStoppedTyping);

    return () => {
      socket.off('friend_is_typing', handleFriendTyping);
      socket.off('friend_stopped_typing', handleFriendStoppedTyping);
    };
  }, []); 

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Kirim event 'typing_start'
    socket.emit('typing_start', { room });

    // Hapus timeout sebelumnya jika ada
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout baru. Jika pengguna berhenti mengetik selama 1.5 detik,
    // kirim event 'typing_stop'.
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { room });
    }, 1500);
  };

useEffect(() => {
    // Mendengarkan update daftar pengguna online
    const handleUpdateOnlineUsers = (onlineUsers: string[]) => {
      // Cek apakah UID teman kita ada di dalam daftar online
      setIsFriendOnline(onlineUsers.includes(friend.uid));
    };
    
    socket.on('update_online_users', handleUpdateOnlineUsers);
    
    // Minta status online saat pertama kali komponen dimuat
    // (Server akan merespons dengan event 'update_online_users')
    // Ini opsional, karena server akan mengirim update saat ada perubahan.
    // Namun, ini memastikan status langsung benar saat chat dibuka.
    socket.emit('request_initial_status');


    // Membersihkan listener saat komponen unmount atau teman berubah
    return () => {
      socket.off('update_online_users', handleUpdateOnlineUsers);
    };
  }, [friend.uid]);


 useEffect(() => {
  // 1. Logika Socket.IO untuk join/leave room
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit('join_room', room);

  // 2. Logika Firestore untuk mengambil dan mendengarkan pesan
const messagesCollection = collection(db, 'chats', room, 'messages');
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
     querySnapshot.docChanges().forEach(() => {
        // Hanya picu notifikasi untuk pesan baru yang BUKAN dari kita
   
      });
    // Update daftar pesan dari Firestore
    const fetchedMessages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp?.toDate().getTime() || Date.now(),
      } as Message;
    });
    setMessages(fetchedMessages);
   // LOGIKA UNTUK UPDATE STATUS 'READ'
    // Cek pesan yang belum dibaca dari teman chat dan update statusnya
    querySnapshot.docs.forEach(document => {
      const message = document.data() as Message;
      if (message.receiverId === currentUser?.uid && message.status === 'sent') {
        const docRef = doc(db, 'chats', room, 'messages', document.id);
        updateDoc(docRef, { status: 'read' });
      }
    });
  });

  // 3. Membersihkan listener saat komponen unmount atau room berubah
  return () => {
    unsubscribe(); // Hentikan listener Firestore
    socket.emit('leave_room', room); // Tinggalkan room socket
  };
}, [room, currentUser?.uid, friend.uid]);

  useEffect(() => {
    // Scroll ke bawah saat ada pesan baru
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const sendMessage = async () => {
  if (!message.trim() || !currentUser) return;

  const tempId = `temp_${Date.now()}`; // ID sementara untuk UI
  const newMessage: Message = {
    id: tempId,
    senderId: currentUser.uid,
    receiverId: friend.uid,
    message,
    timestamp: Date.now(),
    status: 'sending', // 1. Status awal: sending
  };

  // 2. Tampilkan pesan di UI secara instan
  setMessages(prevMessages => [...prevMessages, newMessage]);
  if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit('typing_stop', { room });
  setMessage('');

  try {
    // 3. Simpan pesan ke Firestore
    const messagesCollection = collection(db, 'chats', room, 'messages');
    const docRef = await addDoc(messagesCollection, {
      // Tidak perlu menyertakan id dan status 'sending' ke db
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      message: newMessage.message,
      timestamp: serverTimestamp(),
      status: 'sent', // Langsung set 'sent' saat berhasil disimpan
    });
    
    // Simpan ID dokumen asli untuk pembaruan status 'read' nanti
    await updateDoc(docRef, {
        id: docRef.id
    });
    
    // Pesan akan diperbarui dengan status 'sent' oleh onSnapshot listener
    // Tidak perlu update manual di sini

  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    // 4. Jika gagal, update status di UI menjadi 'failed'
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      )
    );
  }
};

  const handleBack = () => {
    dispatch(clearSelectedFriend());
    navigate('/yu-chat');
  };

  return (
   <div className="flex w-full h-full flex-col -100 shadow-lg rounded-2xl">

     
       {/* Header Chat */}
              <div className="flex items-center justify-between border-b border-b-[#00000042] w-full p-4 lg:relative fixed bg-[#6583f3] z-[99] pb-[40px] lg:rounded-tr-2xl">
              <div onClick={onToggleProfile} className="flex items-center cursor-pointer">
              <button onClick={(e) => { e.stopPropagation(); handleBack(); }} className="mr-4 lg:hidden">
              <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
              </button>
              {friend.photoURL ? (
              <img src={friend.photoURL} alt={friend.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-white">
              {friend.name.charAt(0)}
              </div>
              )}
              <div className="ml-4">
              <h2 className="text-lg text-white font-semibold">{friend.name}</h2>
              {isTyping ? (
              <p className="text-sm text-green-500 bg-gray-100 rounded w-fit p-1 animate-pulse">typing...</p>
              ) : (
              <p className={`text-sm font-bold ${isFriendOnline ? 'text-white bg-green-700 rounded w-fit p-1' : 'text-white bg-gray-500 700 rounded w-fit p-1'}`}>{isFriendOnline ? 'Online •' : 'Offline •'}</p>
              )}
              </div>
              </div>
              {/* toogle */}
              <PiDotsThreeOutlineVerticalFill size={20} onClick={handleToogle} className='cursor-pointer text-white' />
              {toogle && 
              <div className="flex absolute bg-white -bottom-13 rounded p-4 right-0 items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-500"><Maximize2 className="h-5 w-5" /></button>
              <button className="text-gray-600 hover:text-blue-500"><Phone className="h-5 w-5" /></button>
              <button className="text-gray-600 hover:text-blue-500"><Video className="h-5 w-5" /></button>
              <button onClick={onToggleProfile} className="text-gray-600 hover:text-blue-500"><Info className="h-5 w-5" /></button>
              </div>              
              }
              </div>
   
      
        {/* Area Pesan */}
<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white mt-[80px] ">
{messages.length === 0 ? (
  <div className="flex justify-center items-center h-full">
    <p className="text-center text-gray-500">Belum ada chat apapun</p>
  </div>
) : (
  messages.map((msg, index) => (
    <div key={index} className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-full px-7 py-1 ${msg.senderId === currentUser?.uid ? 'bg-[#c6e8f7] text-slate-800 rounded-br-2xl ' : 'bg-[#0000001c] text-gray-800 rounded-bl-2xl '}`}>
        <p>{msg.message}</p>
       <span className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
        <MessageStatus
          status={msg.status}
          isCurrentUser={msg.senderId === currentUser?.uid}
        />
      </div>
    </div>
  ))
)}
<div ref={messagesEndRef} />
</div>
      
      <div className='w-full'>
       {/* Input Pesan */}
<div className="border-t border-t-[#0000002f] p-4">
<div className="flex items-center">
<button className="text-gray-500 hover:text-blue-500 mr-3"><Image className="lg:h-6 lg:w-6 h-5 w-5" /></button>
<button className="text-gray-500 hover:text-blue-500 mr-3"><Smile className="lg:h-6 lg:w-6 h-5 w-5" /></button>
<input
type="text"
value={message}
// Cukup gunakan satu onChange yang sudah kita buat
onChange={handleTyping}
onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
placeholder="Ketik pesan..."
className="flex-1 rounded-full bg-gray-100  w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

<div onClick={sendMessage}>
<SendButton />
</div>

</div>
</div>
      </div>
</div>
   
  );
};

export default Chat;