// src/components/NotificationHandler.tsx

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { collectionGroup, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { RootState } from '../redux/store';
interface Message {
  id?: string; // ID unik dari dokumen Firestore
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'read' | 'failed'; // Status pesan
}

const NotificationHandler = () => {
  // Ambil data pengguna saat ini dan teman yang sedang dipilih dari Redux
  const { selectedUser, selectedFriend } = useSelector((state: RootState) => state.user);
  
  // Ref untuk audio agar tidak dibuat ulang
  const notificationSound = useRef(new Audio('/notif.mp3'));
  
  // Ref untuk menyimpan timestamp kapan listener ini pertama kali aktif
  // Ini untuk mencegah notifikasi berbunyi untuk pesan-pesan lama saat pertama kali login
  const listenerStartTime = useRef(Date.now());

  useEffect(() => {
    // Jangan jalankan apapun jika tidak ada pengguna yang login
    if (!selectedUser?.uid) return;

    // Buat query untuk mendengarkan SEMUA sub-koleksi 'messages'
    // di mana 'receiverId' adalah UID kita.
    const q = query(
      collectionGroup(db, 'messages'), 
      where('receiverId', '==', selectedUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Hitung room ID dari teman yang sedang aktif di chat
      const activeRoomId = selectedFriend 
        ? [selectedUser.uid, selectedFriend.uid].sort().join('-') 
        : null;

      snapshot.docChanges().forEach((change) => {
        // Hanya proses pesan yang BARU ditambahkan
        if (change.type === 'added') {
          const newMessage = change.doc.data() as Message;
          
          // Hitung room ID dari pesan yang baru masuk
          const messageRoomId = [newMessage.senderId, newMessage.receiverId].sort().join('-');
          
          // Konversi timestamp Firestore ke milidetik
          const messageTimestamp = (newMessage.timestamp as unknown as Timestamp)?.toMillis() || 0;

          // KONDISI PENTING:
          // 1. Pesan tidak berasal dari chat yang sedang kita buka (activeRoomId)
          // 2. Pesan ini benar-benar baru (muncul setelah listener aktif)
          if (messageRoomId !== activeRoomId && messageTimestamp > listenerStartTime.current) {
            notificationSound.current.play().catch(error => {
              console.log("Gagal memutar suara notifikasi:", error);
            });
          }
        }
      });
    });

    // Bersihkan listener saat komponen unmount
    return () => unsubscribe();

  }, [selectedUser, selectedFriend]); // Jalankan ulang jika user atau teman yang dipilih berubah

  // Komponen ini tidak merender apapun
  return null;
};

export default NotificationHandler;