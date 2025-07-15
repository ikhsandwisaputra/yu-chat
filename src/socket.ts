// src/socket.ts

import { io } from 'socket.io-client';

// Ganti URL ini dengan URL backend Socket.IO kamu
const SOCKET_URL = 'http://localhost:5000'; 

const socket = io(SOCKET_URL, {
  autoConnect: false, // Jangan terhubung secara otomatis dulu
});

export default socket;