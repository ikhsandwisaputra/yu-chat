import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


import 'firebase/compat/firestore';
interface User {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  login: boolean;
  friends?: string[];

}

interface UserState {
  selectedUser: User | null; // Bukan array lagi
  selectedFriend: User | null, // atau sesuaikan dengan tipe User

}

const initialState: UserState = {
  selectedUser: null,
  selectedFriend: null, // atau sesuaikan dengan tipe User
  
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload; // Langsung assign, bukan push ke array
    },
    logout: (state) => {
      state.selectedUser = null;
      state.selectedUser = {
        uid: '',
        email: '',
        name: '',
        photoURL: '',
        login: false,
        friends: []
      };
      state.selectedUser.name = '';
      state.selectedUser.email = '';
      state.selectedUser.photoURL = '';
      state.selectedUser.login = false;
      state.selectedUser.friends = [];

    },// Tambahkan ini di reducers
setSelectedFriend: (state, action) => {
  state.selectedFriend = action.payload;
},
  clearSelectedFriend: (state) => {
      state.selectedFriend = null; // atau {} jika awalnya object kosong
    },
  },
});


export const { setSelectedUser, logout, setSelectedFriend, clearSelectedFriend } = userSlice.actions;
export default userSlice.reducer;
