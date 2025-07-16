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
  <div className="relative flex h-screen w-full overflow-hidden bg-[#f1f5f9]">
    {/* Sidebar daftar chat */}
    <div className={`z-10 h-full w-full max-w-xs border-r bg-white lg:flex ${selectedFriend ? 'hidden' : 'flex'}`}>
      <DaftarEmailChat />
    </div>

    {/* Chat box */}
    <div className={`relative flex h-full flex-1 flex-col bg-white ${!selectedFriend ? 'hidden lg:flex' : 'flex'}`}>
      {selectedFriend ? (
        <Chat friend={selectedFriend} onToggleProfile={handleToggleProfile} />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          Pilih teman untuk memulai percakapan
        </div>
      )}
    </div>

    {/* Info profil */}
    {selectedFriend && (
      <div
        className={`
          absolute right-0 top-0 z-20 h-full w-full max-w-sm transform bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isProfileVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <InfoEmailProfile profile={selectedFriend} onClose={() => setIsProfileVisible(false)} />
      </div>
    )}
  </div>
);
}

export default ChatPage;