// src/components/Sidebar.tsx
import {  Users, FileText, Blocks, Bell, LogOut, MessageSquare, SearchCheck } from 'lucide-react';
import { FaUserFriends } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 2. Impor useDispatch
import { logout } from '@/redux/slices/userSlice'; // 3. Impor action logout
import { 
 FiMenu, FiX 
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Untuk redirect setelah logout
    // State untuk mengontrol visibilitas sidebar di mobile
  const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

  useEffect(() => {
    setIsOpen(false); // tutup sidebar saat route berubah
  }, [location.pathname]);
// const [isOpen, setIsOpen] = useState(false);
  // 5. Buat fungsi handleLogout
  const handleLogout = () => {
    dispatch(logout()); // Panggil action logout dari Redux
    navigate('/register'); // Arahkan pengguna ke halaman login
  }; // 4. Inisialisasi dispatch
  return (
    <>
    
      {/* Tombol Toggle Mobile */}
      <button
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-brand-primary rounded-md text-black"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white w-64 flex flex-col 
          fixed top-0 left-0 z-20 lg:relative
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          h-screen lg:h-full overflow-y-auto rounded-l-2xl pt-[25px]
        `}
      >
      <div className="flex h-16 items-center -b px-6">
        <h1
         
          className="text-xl font-bold text-gray-800"
        >
          Yu Chat 😽
        </h1>
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
<NavLink
  to="/find-emails-chat"
  className={({ isActive }) =>
    `flex items-center rounded-lg px-4 py-2 font-semibold ${
      isActive
        ? 'text-blue-600 -l-4 -blue-600 bg-blue-100'
        : 'text-black bg-blue-50'
    }`
  }
>
  <SearchCheck className="mr-3 h-5 w-5" />
  Find Emails
</NavLink>
        <p className="px-4 pt-4 text-xs font-semibold uppercase text-gray-400">Applicants</p>
        <a href="#" className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"><Users className="mr-3 h-5 w-5" /> Applicants</a>
        <a href="#" className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"><FileText className="mr-3 h-5 w-5" /> Resumes</a>
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
      </nav>
    
       {/* 6. Tambahkan tombol Logout di bagian bawah */}
    </aside>
    </>
  );
};

export default Sidebar;