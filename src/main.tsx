import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Provider } from "@/components/ui/provider"
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import FindEmailsChat from './pages/FindEmailsChat.tsx'
import ChatPage from './pages/ChatPage.tsx'
import EmailFriendLists from './pages/EmailFriendLists.tsx';
import FriendRequests from './pages/FriendRequests.tsx';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    {/* <Provider> */}
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter >
      <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-emails-chat" element={<FindEmailsChat />} />
      <Route path='/yu-chat' element={<ChatPage />}></Route>      
      <Route path='/yu-chat/my-list-friends' element={<EmailFriendLists />}></Route>      
      <Route path='*' element={<NotFoundPage />}></Route>      
      <Route
        path='/friend-requests'
        element={
          
            <FriendRequests />
          
        }
      />
      </Routes>      
      <ToastContainer />
      </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
