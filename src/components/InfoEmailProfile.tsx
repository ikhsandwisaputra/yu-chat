// src/components/InfoEmailProfile.tsx
import { MapPin, Phone, X } from 'lucide-react';
import { type ProfileInfo } from '../data/dummyData';
// DATA REDUX STATE
import { type RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from "@/redux/slices/userSlice"
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import {useNavigate} from 'react-router-dom';
interface InfoEmailProfileProps {
  profile: ProfileInfo | undefined;
  onClose: () => void;
}

const InfoEmailProfile = ({ profile, onClose }: InfoEmailProfileProps) => {
    const navigate = useNavigate();
      const dispatch = useDispatch();
 const user = useSelector((state: RootState) => state.user.selectedUser);  
  if (!profile) return null;
const handleLogout = async () => {
  try {
    await signOut(auth); // Firebase logout
    dispatch(logout());  // Redux reset user
    localStorage.clear(); // Optional: clear local storage
    navigate('/');
  } catch (error) {
    console.error("Logout gagal:", error);
  }
};
  
  return (
    <aside className="absolute right-0 top-0 z-20 h-full w-full flex-col border-l bg-white transition-transform duration-300 ease-in-out md:w-96 lg:static lg:z-auto lg:translate-x-0">
       <div className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <h3 className="font-semibold text-gray-800">Informations</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="h-6 w-6" />
          </button>
      </div>
      <div className="overflow-y-auto p-6 text-center">
          <img src={`${user?.photoURL}`} alt={user?.name} className="mx-auto h-24 w-24 rounded-full" referrerPolicy="no-referrer"/>
          <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-gray-500">{profile.title}</p>
          <div className="mt-6 space-y-4 text-left text-sm">
              <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile.location}</span>
              </div>
              <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user?.email}</span>
              </div>
          </div>
          <div className="mt-6">
              <h4 className="text-left font-semibold text-gray-800">Media ({profile.media.length})</h4>
              <div className="mt-2 grid grid-cols-3 gap-2">
                  {profile.media.map((src, index) => (
                      <img key={index} src={src} alt={`media ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                  ))}
              </div>
          </div>
          <button onClick={handleLogout} className="mt-6 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">Logout</button>
      </div>
    </aside>
  );
};
export default InfoEmailProfile;