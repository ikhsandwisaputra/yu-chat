// src/socket.ts

import { io } from 'socket.io-client';

// Ganti URL ini dengan URL backend Socket.IO kamu
const SOCKET_URL = 'https://server-yu-chat-production.up.railway.app/'; 

const socket = io(SOCKET_URL, {
  autoConnect: false, // Jangan terhubung secara otomatis dulu
});

export default socket;