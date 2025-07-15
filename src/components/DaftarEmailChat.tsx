// src/components/DaftarEmailChat.tsx
import { Search } from 'lucide-react';
import type { User } from '../data/dummyData';

interface DaftarEmailChatProps {
  users: User[];
  selectedUserId: number | null;
  onSelectChat: (userId: number) => void;
}

const DaftarEmailChat = ({ users, selectedUserId, onSelectChat }: DaftarEmailChatProps) => {
  return (
    <div className="flex w-full flex-col border-r bg-white lg:w-96">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search Messenger" className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => onSelectChat(user.id)}
            className={`flex cursor-pointer items-center px-6 py-4 transition-colors ${
              selectedUserId === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="relative">
              <img className="h-12 w-12 rounded-full" src={user.avatar} alt={user.name} />
              {user.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.timestamp}</p>
              </div>
              <p className="mt-1 truncate text-sm text-gray-600">{user.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarEmailChat;