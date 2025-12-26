import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import axios from "axios";
import { getMe } from "./features/authSlice";

// Agar credential (cookie/token) selalu dikirim
axios.defaults.withCredentials = true;          

// Load current user on app startup so sidebar tetap konsisten setelah refresh
store.dispatch(getMe());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
            <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);