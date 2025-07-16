// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import Halaman dan Layout
import Register from './pages/Register';
import NotFoundPage from './pages/NotFoundPage';
import FindEmailsChat from './components/FindEmailsChat';
import ChatPage from './pages/ChatPage';
import EmailFriendLists from './pages/EmailFriendLists';
import FriendRequests from './pages/FriendRequests';
import MainLayout from './layouts/MainLayout'; // <-- Import layout utama

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/yu-chat">
          <Routes>
            {/* Rute tanpa layout */}
            <Route path="/register" element={<Register />} />
            
            {/* Rute yang menggunakan MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/yu-chat" element={<ChatPage />} />
              <Route path="/yu-chat/my-list-friends" element={<EmailFriendLists />} />
              <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="/find-emails-chat" element={<FindEmailsChat />} />
            </Route>

            {/* Rute lain jika ada */}
            <Route path='*' element={<NotFoundPage />} />
             <Route path="/" element={<Register />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);