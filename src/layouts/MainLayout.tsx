// src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-x-hidden bg-[#bedfff] font-sans lg:p-[25px]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white lg:rounded-r-2xl">
        <Outlet /> {/* <-- Konten halaman akan dirender di sini */}
      </main>
    </div>
  );
};

export default MainLayout;