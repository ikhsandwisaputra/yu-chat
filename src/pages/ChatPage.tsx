// src/ChatPage.tsx
import {  useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DaftarEmailChat from '@/components/DaftarEmailChat';
import Chat from '@/components/Chat';
import InfoEmailProfile from '@/components/InfoEmailProfile';
import { users, messages, profileInfos } from '@/data/dummyData';
import { type RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(1);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();
 const user = useSelector((state: RootState) => state.user.selectedUser);  


  const handleSelectChat = (userId: number) => {
    setSelectedUserId(userId);
    setIsProfileVisible(false); // Sembunyikan profil saat ganti chat
  };

  const handleToggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };
  
  // Untuk tombol back di mobile
  const handleBackToList = () => {
      setSelectedUserId(null);
  }

  const selectedUser = users.find(u => u.id === selectedUserId);
  const selectedMessages = selectedUserId ? messages[selectedUserId] || [] : [];
  const selectedProfile = profileInfos[selectedUserId!];

useEffect(() => {
  if (!user?.login) {
    navigate("/");
  }
});
  return (
    <div className="flex h-screen w-full overflow-hidden important bg-gray-100 font-sans">
      
      <Sidebar />
      
      {/* Mobile view logic */}
      <div className="flex flex-1 lg:static">
          <div className={`w-full transition-transform duration-300 ease-in-out lg:w-96 ${selectedUserId && 'hidden lg:flex'}`}>
              <DaftarEmailChat 
                  users={users} 
                  selectedUserId={selectedUserId} 
                  onSelectChat={handleSelectChat} 
              />
          </div>
          
          <div className={`w-full flex-1 transition-transform duration-300 ease-in-out ${!selectedUserId && 'hidden lg:flex'}`}>
              <Chat 
                  user={selectedUser} 
                  messages={selectedMessages} 
                  onToggleProfile={handleToggleProfile}
                  onBack={handleBackToList}
              />
          </div>
      </div>

      {/* Info Profile Panel (overlay on mobile, static on desktop) */}
      <div className={`absolute top-0 right-0 h-full w-full transform transition-transform duration-300 ease-in-out md:w-96 
        ${isProfileVisible ? 'translate-x-0' : 'translate-x-full'}`}>
          <InfoEmailProfile 
              profile={selectedProfile}
              onClose={() => setIsProfileVisible(false)}
          />
      </div>
    </div>
  );
}

export default ChatPage;