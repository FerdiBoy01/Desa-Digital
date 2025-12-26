import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import { LogOut, reset } from "../../features/authSlice";
import { 
    FaChartLine, FaUsers, FaClipboardList, FaCogs, 
    FaSignOutAlt, FaBars, FaTimes, FaGithub, FaUserCircle, FaBox,
    FaFilePdf
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
    <div className="flex h-screen bg-[#f6f8fa] font-sans text-slate-900">
      
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-[#24292f] text-white transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex-shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header Sidebar (Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
            <FaGithub className="text-3xl mr-3" />
            <Link to="/dashboard" className="font-bold text-lg tracking-tight hover:text-gray-300 transition">
                Admin<span className="font-normal text-gray-400">Panel</span>
            </Link>
            
            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-gray-400">
                <FaTimes />
            </button>
        </div>

        {/* User Info Kecil */}
        <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{user?.name || "Loading..."}</p>
                    <p className="text-xs text-gray-400 truncate capitalize">{user?.role || "Guest"}</p>
                </div>
            </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavItem to="/dashboard" icon={<FaChartLine />} text="Dashboard" />
            <NavItem to="/users" icon={<FaUsers />} text="Users" />
            <NavItem to="/surveys" icon={<FaClipboardList />} text="Repositories (Survey)" />
            <NavItem to="/programs" icon={<FaBox />} text="Kelola Program" />
            
            {/* --- MENU BARU DITAMBAHKAN DISINI --- */}
            <NavItem to="/admin/laporan" icon={<FaFilePdf />} text="Laporan Resmi" />

            <NavItem to="/settings" icon={<FaCogs />} text="Settings" />
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-700">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 rounded-md transition"
            >
                <FaSignOutAlt /> Sign out
            </button>
        </div>
      </aside>

      {/* --- KONTEN AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER MOBILE */}
        <header className="md:hidden flex items-center justify-between bg-[#24292f] text-white p-4 shadow-sm z-10">
            <div className="flex items-center gap-2">
                <FaGithub className="text-2xl" />
                <span className="font-bold">Dashboard</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white">
                <FaBars className="text-xl" />
            </button>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
        
      </div>
    </div>
  );
};

// --- NAV ITEM COMPONENT ---
const NavItem = ({ icon, text, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== "/dashboard");

    return (
        <Link to={to} className={`
            flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
            ${isActive 
                ? "bg-gray-800 text-white border-l-4 border-blue-500" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }
        `}>
            <span className={`${isActive ? "text-blue-400" : "text-gray-500"}`}>{icon}</span>
            <span>{text}</span>
        </Link>
    );
};

export default LayoutAdmin;