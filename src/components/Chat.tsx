// src/components/Chat.tsx
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import type { User, Message } from '../data/dummyData';
import { type RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
interface ChatProps {
  user: User | undefined;
  messages: Message[];
  onToggleProfile: () => void;
  onBack: () => void;
}

const Chat = ({ user, messages, onToggleProfile, onBack }: ChatProps) => {
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  if (!user) {
    return (
      <div className="hidden flex-1 items-center justify-center text-gray-400 lg:flex">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <div className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 lg:hidden">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <img
                src={currentUser?.photoURL} 
                alt={currentUser?.name}
                className="h-10 w-10 cursor-pointer rounded-full"
                onClick={onToggleProfile}
                referrerPolicy="no-referrer"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{currentUser?.name}</p>
              {user.online && <p className="text-xs text-green-500">Online</p>}
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                <img src={msg.sender === 'me' ? 'https://i.pravatar.cc/150?u=me' : user.avatar} alt="sender" className="h-8 w-8 rounded-full" />
                <div className={`max-w-xs rounded-xl p-4 md:max-w-md ${msg.sender === 'me' ? 'rounded-br-none bg-blue-500 text-white' : 'rounded-bl-none bg-white text-gray-800'}`}>
                    <p>{msg.text}</p>
                    <p className={`mt-2 text-xs ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="relative">
          <input type="text" placeholder="Write a message..." className="w-full rounded-lg border bg-gray-100 py-3 pl-4 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600"><Paperclip /></button>
            <button className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"><Send /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;