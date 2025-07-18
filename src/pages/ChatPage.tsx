// src/pages/ChatPage.tsx

import { useEffect, useState } from 'react';
import DaftarEmailChat from '@/components/DaftarEmailChat';
import Chat from '@/components/Chat';
import { type RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import InfoEmailProfile from '@/components/InfoEmailProfile';

function ChatPage() {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const selectedFriend = useSelector((state: RootState) => state.user.selectedFriend);

  const handleToggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  useEffect(() => {
    // ... Logika useEffect Anda tetap sama ...
    if (!currentUser?.login) {
      navigate("/");
    } else {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('user_online', currentUser.uid);
    }
    if (currentUser && selectedFriend) {
      const room = [currentUser.uid, selectedFriend.uid].sort().join('-');
      socket.emit('join_room', room);
    }
  }, [currentUser, selectedFriend, navigate]);

  // Hapus div pembungkus utama di sini
  return (
    <div className="flex w-full relative lg:static h-full overflow-hidden  rounded-2xl"> {/* Ubah div ini */}
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
          <div className="flex items-center justify-center h-full text-gray-500 bg-white rounded-lg">
            Pilih teman untuk memulai percakapan
          </div>
        )}
      </div>
      
      {selectedFriend && (
        <div 
          className={`
           absolute w-full transform transition-transform duration-300 right-0 rounded-l-2xl h-full top-0 ease-in-out md:w-96  z-[999999999]
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
  );
}

export default ChatPage;