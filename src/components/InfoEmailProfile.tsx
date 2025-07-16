// src/components/InfoEmailProfile.tsx

import { X, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// Kita gunakan interface yang sama dengan yang ada di komponen lain
// agar konsisten.
interface Profile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt?: string | null; // Tambahkan createdAt untuk menampilkan tanggal bergabung
}

interface InfoEmailProfileProps {
  profile: Profile;
  onClose: () => void;
}

const InfoEmailProfile = ({ profile, onClose }: InfoEmailProfileProps) => {

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Info tidak tersedia';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <div className="flex  my-6 flex-col bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Detail Kontak</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Konten Profil Utama */}
      <div className="flex flex-col items-center  p-6">
        {profile.photoURL ? (
          <img 
            src={profile.photoURL} 
            alt={profile.name} 
            className="h-24 w-24 rounded-full object-cover" 
            referrerPolicy='no-referrer' 
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-500">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h3 className="mt-4 text-2xl font-semibold">{profile.name}</h3>
        {/* Kamu bisa menambahkan role atau status di sini jika ada datanya */}
        <p className="mt-1 text-sm text-gray-500">Status: Online</p> 
      </div>

      {/* Detail Informasi */}
      <div className="flex-1 space-y-6 p-6 overflow-y-auto">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-400 mt-1" />
          <div className="ml-4">
            <p className="font-semibold text-gray-800">Email</p>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-gray-400 mt-1" />
           <div className="ml-4">
            <p className="font-semibold text-gray-800">Telepon</p>
            {/* Ganti dengan data asli jika ada */}
            <p className="text-gray-600">Info tidak tersedia</p> 
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
           <div className="ml-4">
            <p className="font-semibold text-gray-800">Lokasi</p>
            {/* Ganti dengan data asli jika ada */}
            <p className="text-gray-600">Info tidak tersedia</p>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-400 mt-1" />
           <div className="ml-4">
            <p className="font-semibold text-gray-800">Bergabung pada</p>
            <p className="text-gray-600">{formatDate(profile.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi (Opsional) */}
      <div className="p-4 ">
        <button className="w-full rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600">
          Hapus Teman
        </button>
      </div>
    </div>
  );
};

export default InfoEmailProfile;