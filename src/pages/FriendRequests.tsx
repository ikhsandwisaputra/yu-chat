// Lokasi: src/pages/FriendRequests.tsx

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store'; // Ambil RootState dari store Redux Anda
 // Ambil RootState dari store Redux Anda
import { toast } from 'react-toastify';
import { UserMinus, UserPlus } from 'lucide-react';



// Interface yang sama seperti sebelumnya
interface RequestWithSender extends DocumentData {
  requestId: string;
  sender: DocumentData;
}

interface RawRequestData extends DocumentData {
  requestId: string;
  sender: DocumentData | null;
}

const FriendRequests = () => {
  // Ganti useAuth dengan useSelector dari Redux
  const currentUser = useSelector((state: RootState) => state.user.selectedUser);
  const [requests, setRequests] = useState<RequestWithSender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser?.login) return;

      setLoading(true);
      try {
        const requestsRef = collection(db, 'friendRequests');
        const q = query(
          requestsRef,
          where('to', '==', currentUser?.uid),
          where('status', '==', 'pending')
        );
        const requestSnapshots = await getDocs(q);

        if (requestSnapshots.empty) {
          setRequests([]);
          setLoading(false);
          return;
        }

        const requestsData: RawRequestData[] = await Promise.all(
          requestSnapshots.docs.map(async (requestDoc) => {
            const request = requestDoc.data();
            const senderRef = doc(db, 'users', request.from);
            const senderSnap = await getDoc(senderRef);
            return {
              requestId: requestDoc.id,
              sender: senderSnap.data() || null,
              ...request,
            };
          })
        );

        const validRequests = requestsData.filter(
          (req): req is RequestWithSender => !!req.sender
        );
        setRequests(validRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        toast.error('Gagal memuat permintaan pertemanan.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser?.uid, currentUser?.login]); // Tambahkan dependency yang benar

  // Fungsi handleAcceptRequest dan handleDeclineRequest tidak berubah
  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    if (!currentUser?.login) return;
    try {
      const currentUserRef = doc(db, 'users', currentUser.uid);
      await updateDoc(currentUserRef, { friends: arrayUnion(senderId) });

      const senderRef = doc(db, 'users', senderId);
      await updateDoc(senderRef, { friends: arrayUnion(currentUser.uid) });

      await deleteDoc(doc(db, 'friendRequests', requestId));

      toast.success('Permintaan pertemanan diterima!');
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Gagal menerima permintaan.');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', requestId));

      toast.info('Permintaan pertemanan ditolak.');
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error('Gagal menolak permintaan.');
    }
  };

  // Gunakan struktur layout yang sama dengan halaman lain
  return (
   
      <div className="flex flex-col flex-grow">
        
        <div className="p-4 md:p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-slate-800">
            Permintaan Pertemanan
          </h1>
          {loading ? (
            <p className="text-center p-10 text-slate-400">Memuat...</p>
          ) : requests.length > 0 ? (
            <ul className="space-y-3">
              {requests.map((req) => (
                <li
                  key={req.requestId}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.sender.photoURL}
                      alt={req.sender.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-100">
                        {req.sender.displayName}
                      </p>
                      <p className="text-sm text-slate-400">
                        {req.sender.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAcceptRequest(req.requestId, req.from)
                      }
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Terima"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.requestId)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Tolak"
                    >
                      <UserMinus size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center p-10 text-slate-800">
              Tidak ada permintaan pertemanan saat ini.
            </p>
          )}
        </div>
      </div>
    
  );
};

export default FriendRequests;