import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import { 
    FaHome, FaUsers, FaClipboardList, FaSignOutAlt, 
    FaHandHoldingHeart, FaBoxOpen, FaFilePdf,
    FaMapMarkedAlt // <--- 1. TAMBAHKAN IMPORT ICON INI
} from "react-icons/fa";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
      
      // Hanya Admin yang bisa atur user
      ...(user && user.role === "admin" ? [
          { name: "Data Pengguna", path: "/users", icon: <FaUsers /> }
      ] : []),

      { name: "Data Pengajuan", path: "/surveys", icon: <FaClipboardList /> },
      
      // --- 2. MENU BARU: PETA SEBARAN (GIS) ---
      { name: "Peta Sebaran", path: "/maps", icon: <FaMapMarkedAlt /> },
      // ----------------------------------------

      { name: "Program Bantuan", path: "/programs", icon: <FaBoxOpen /> },
      { name: "Laporan Resmi", path: "/admin/laporan", icon: <FaFilePdf /> },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl">
      
      {/* BRANDING */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/50">
           <FaHandHoldingHeart />
        </div>
        <div>
            <h1 className="text-lg font-bold tracking-wide">Bansos<span className="text-indigo-500">Kita</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>
      </div>

      {/* USER INFO MINI */}
      <div className="px-6 py-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{user && user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user && user.role}</p>
              </div>
          </div>
      </div>

      {/* MENU LIST */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu Utama</p>
        
        {menuItems.map((item) => (
            <NavLink 
                key={item.name}
                to={item.path} 
                className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                    }`
                }
            >
                <span className="text-lg">{item.icon}</span>
                {item.name}
            </NavLink>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-medium text-sm group"
        >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> 
            Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;