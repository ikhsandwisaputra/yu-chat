// src/components/Sidebar.tsx
import {  Users, FileText, Blocks, Bell, LogOut, MessageSquare } from 'lucide-react';
import { FaUserFriends } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 2. Impor useDispatch
import { logout } from '@/redux/slices/userSlice'; // 3. Impor action logout

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Untuk redirect setelah logout

  // 5. Buat fungsi handleLogout
  const handleLogout = () => {
    dispatch(logout()); // Panggil action logout dari Redux
    navigate('/register'); // Arahkan pengguna ke halaman login
  }; // 4. Inisialisasi dispatch
  return (
    <aside className="hidden w-64 flex-col  bg-white lg:flex">
      <div className="flex h-16 items-center -b px-6">
        <h1 className="text-xl font-bold text-gray-800">Nata Job</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <p className="px-4 text-xs font-semibold uppercase text-gray-400">Main Menu</p>     

       <NavLink
  to="/yu-chat"
   end
  className={({ isActive }) =>
    `flex items-center rounded-lg px-4 py-2 font-semibold ${
      isActive
        ? 'text-blue-600 -l-4 -blue-600 bg-blue-100'
        : 'text-black bg-blue-50'
    }`
  }
>
  <MessageSquare className="mr-3 h-5 w-5" />
  Messages
</NavLink>

<NavLink
  to="/yu-chat/my-list-friends"
  className={({ isActive }) =>
    `flex items-center rounded-lg px-4 py-2 font-semibold ${
      isActive
        ? 'text-blue-600 -l-4 -blue-600 bg-blue-100'
        : 'text-black bg-blue-50'
    }`
  }
>
  <FaUserFriends className="mr-3 h-5 w-5" />
  Friend Lists
</NavLink>

<NavLink
  to="/friend-requests"
  className={({ isActive }) =>
    `flex items-center rounded-lg px-4 py-2 font-semibold ${
      isActive
        ? 'text-blue-600 -l-4 -blue-600 bg-blue-100'
        : 'text-black bg-blue-50'
    }`
  }
>
  <Bell className="mr-3 h-5 w-5" />
  Requests
</NavLink>
        <p className="px-4 pt-4 text-xs font-semibold uppercase text-gray-400">Applicants</p>
        <a href="#" className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"><Users className="mr-3 h-5 w-5" /> Applicants</a>
        <a href="#" className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"><FileText className="mr-3 h-5 w-5" /> Resumes</a>
      </nav>
      <div className="p-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
            <Blocks className="mx-auto h-8 w-8 text-blue-500"/>
            <h3 className="font-semibold text-gray-800 mt-2">Integration Apps</h3>
            <p className="text-xs text-gray-600 mt-1">You can integrate several apps to automate productivity.</p>
            <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">Try Integration</button>
        </div>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center space-x-2 rounded-lg p-2 text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-red-100 cursor-pointer bg-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      </div>
       {/* 6. Tambahkan tombol Logout di bagian bawah */}
    </aside>
  );
};

export default Sidebar;