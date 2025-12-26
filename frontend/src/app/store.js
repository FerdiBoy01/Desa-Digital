import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice'; // <--- Import ini
import biodataReducer from '../features/biodataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer ,// <--- Tambahkan ini
    biodata: biodataReducer
  },
});