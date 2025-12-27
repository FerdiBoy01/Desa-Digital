import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import { LogOut, reset } from "../../features/authSlice";
import { 
    FaChartLine, FaUsers, FaClipboardList, FaCogs, 
    FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaBox,
    FaFilePdf, FaMapMarkedAlt, FaHandHoldingHeart // Ganti FaGithub dengan ini
} from "react-icons/fa";

const LayoutAdmin = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
          md:translate-x-0 md:static md:flex-shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* 1. Header Sidebar (Branding Baru) */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950">
            <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/50 group-hover:bg-indigo-500 transition">
                    <FaHandHoldingHeart />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-wide leading-none">
                        Bansos<span className="text-indigo-500">Kita</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                        Admin Panel
                    </p>
                </div>
            </Link>
            
            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-slate-400 hover:text-white transition">
                <FaTimes />
            </button>
        </div>

        {/* 2. User Info Kecil (Redesign) */}
        <div className="px-5 py-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user?.name || "Loading..."}</p>
                    <p className="text-xs text-slate-400 truncate capitalize">{user?.role || "Guest"}</p>
                </div>
            </div>
        </div>

        {/* 3. Menu Navigasi */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
            
            <NavItem to="/dashboard" icon={<FaChartLine />} text="Dashboard" />
            
            {/* --- MENU KHUSUS ADMIN --- */}
            {user && user.role === "admin" && (
                <>
                    <NavItem to="/users" icon={<FaUsers />} text="Users Management" />
                    <NavItem to="/maps" icon={<FaMapMarkedAlt />} text="Peta Sebaran" />
                </>
            )}
            
            <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Data & Laporan</p>
            
            <NavItem to="/surveys" icon={<FaClipboardList />} text="Data Survey" />
            <NavItem to="/programs" icon={<FaBox />} text="Program Bantuan" />
            <NavItem to="/admin/laporan" icon={<FaFilePdf />} text="Laporan Resmi" />

            <div className="my-4 border-t border-slate-800"></div>
            <NavItem to="/settings" icon={<FaCogs />} text="Pengaturan" />
        </nav>

        {/* 4. Footer Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 group"
            >
                <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> 
                Sign out
            </button>
        </div>
      </aside>

      {/* --- KONTEN AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER MOBILE (Warna disesuaikan) */}
        <header className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shadow-md z-10 sticky top-0">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-xs">
                    <FaHandHoldingHeart />
                </div>
                <span className="font-bold tracking-wide">BansosKita</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300 hover:text-white transition">
                <FaBars className="text-xl" />
            </button>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f6f8fa]">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
        
      </div>
    </div>
  );
};

// --- NAV ITEM COMPONENT (Updated Style) ---
const NavItem = ({ icon, text, to }) => {
    const location = useLocation();
    // Logic active: jika path sama persis ATAU path diawali 'to' (kecuali dashboard agar tidak nyala terus)
    const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== "/dashboard");

    return (
        <Link to={to} className={`
            flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
            ${isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
            }
        `}>
            <span className={`text-lg ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`}>
                {icon}
            </span>
            <span>{text}</span>
        </Link>
    );
};

export default LayoutAdmin;