// src/components/Chat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Phone, Video, Info, Image, Smile, Send, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import socket from '../socket';
import { useDispatch } from 'react-redux';
import { clearSelectedFriend } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

interface Friend {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  friend: Friend;
  onToggleProfile: () => void;
}

const Chat = ({ friend, onToggleProfile }: ChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [isFriendOnline, setIsFriendOnline] = useState(false); 
  const room = [currentUser?.uid, friend.uid].sort().join('-');
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
    // Pastikan socket terhubung
    if (!socket.connected) {
      socket.connect();
    }

    // Bergabung ke room saat komponen dimuat
    socket.emit('join_room', room);

    // Menerima pesan baru
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    
    socket.on('receive_message', handleNewMessage);

    // Membersihkan listener saat komponen di-unmount
    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.emit('leave_room', room);
    };
  }, [room]);

  useEffect(() => {
    // Scroll ke bawah saat ada pesan baru
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage: Message = {
        senderId: currentUser.uid,
        receiverId: friend.uid,
        message,
        timestamp: Date.now(),
      };

      socket.emit('send_message', { room, message: newMessage });
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleBack = () => {
    dispatch(clearSelectedFriend());
    navigate('/yu-chat');
  };

  return (
    <div className="flex h-screen flex-col bg-white shadow-lg">
      {/* Header Chat */}
      <div className="flex items-center justify-between border-b p-4">
        <div onClick={onToggleProfile} className="flex items-center cursor-pointer">
         <button onClick={(e) => { e.stopPropagation(); handleBack(); }} className="mr-4 lg:hidden">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          {friend.photoURL ? (
            <img src={friend.photoURL} alt={friend.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              {friend.name.charAt(0)}
            </div>
          )}
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{friend.name}</h2>
             <p className={`text-sm ${isFriendOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isFriendOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-500"><Maximize2 className="h-5 w-5" /></button>
          <button className="text-gray-600 hover:text-blue-500"><Phone className="h-5 w-5" /></button>
          <button className="text-gray-600 hover:text-blue-500"><Video className="h-5 w-5" /></button>
          <button onClick={onToggleProfile} className="text-gray-600 hover:text-blue-500"><Info className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${msg.senderId === currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p>{msg.message}</p>
              <span className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Pesan */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-blue-500 mr-3"><Image className="h-6 w-6" /></button>
          <button className="text-gray-500 hover:text-blue-500 mr-3"><Smile className="h-6 w-6" /></button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ketik pesan..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="ml-3 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;