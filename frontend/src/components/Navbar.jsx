import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, reset } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg" role="navigation">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          My App
        </div>
        <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden md:block">Halo, {user && user.name}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Log Out
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;