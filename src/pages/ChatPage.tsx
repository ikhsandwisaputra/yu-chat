// src/pages/ChatPage.tsx

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DaftarEmailChat from '@/components/DaftarEmailChat';
import Chat from '@/components/Chat';
import InfoEmailProfile from '@/components/InfoEmailProfile';
import { type RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../socket'; // Impor socket


function ChatPage() {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const selectedFriend = useSelector((state: RootState) => state.user.selectedFriend);

  const handleToggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  useEffect(() => {
    if (!currentUser?.login) {
      navigate("/");
    }else {
      // Jika socket belum terhubung, hubungkan
      if (!socket.connected) {
        socket.connect();
      }
      // Beritahu server bahwa user ini online
      socket.emit('user_online', currentUser.uid);
    }

    if (currentUser && selectedFriend) {
      const room = [currentUser.uid, selectedFriend.uid].sort().join('-');
      socket.emit('join_room', room);
    }

  }, [currentUser, selectedFriend, navigate]);

  return (
    <>
    
    
    <div className="flex h-screen w-full overflow-hidden bg-[#bedfff] font-sans p-[25px]  ">
      <Sidebar />
      <div className="flex flex-1 lg:static">
        <div className={`w-full transition-transform duration-300 ease-in-out lg:w-96 ${selectedFriend && 'hidden lg:flex'}`}>
          <DaftarEmailChat />
        </div>
        
        <div className={`w-full flex-1 transition-transform duration-300 ease-in-out ${!selectedFriend && 'hidden lg:flex'}`}>
          {selectedFriend ? (
            <Chat 
              friend={selectedFriend} 
              onToggleProfile={handleToggleProfile}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Pilih teman untuk memulai percakapan
            </div>
          )}
        </div>
      </div>
      
      {/* Hapus `isProfileVisible &&` dari sini.
        Kita tetap butuh `selectedFriend` agar panel tidak render saat tidak ada teman dipilih.
      */}
      {selectedFriend && (
        <div 
          className={`
            absolute top-0 right-0 h-full w-full transform transition-transform duration-300 ease-in-out md:w-96 
            ${isProfileVisible ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <InfoEmailProfile 
            profile={selectedFriend}
            onClose={() => setIsProfileVisible(false)}
          />
        </div>
      )}
    </div>
    </>
  );
}

export default ChatPage;