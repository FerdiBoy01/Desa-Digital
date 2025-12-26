import React, { useEffect } from 'react';
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import { useDispatch, useSelector } from "react-redux";
import { getUsers, userSelectors } from "../../features/userSlice";
import { 
    FaUsers, FaHandHoldingHeart, FaClipboardCheck, FaMapMarkedAlt, 
    FaUserCheck, FaUserClock, FaBoxOpen 
} from "react-icons/fa";

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  
  // 1. Ambil Data Real dari Redux
  const users = useSelector(userSelectors.selectAll);
  
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // 2. Hitung Statistik Sederhana berdasarkan Role
  const countTotal = users.length;
  const countRecipients = users.filter(u => u.role === 'user').length; // Calon Penerima
  const countSurveyors = users.filter(u => u.role === 'survey').length; // Tim Lapangan
  const countAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <LayoutAdmin>
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-semibold text-slate-900">Dashboard Penyaluran</h2>
                <p className="text-sm text-slate-500 mt-1">Pantau statistik penyaluran bantuan sosial secara real-time.</p>
            </div>
            <button className="bg-[#2da44e] hover:bg-[#2c974b] text-white text-sm font-medium px-4 py-1.5 rounded-md border border-[rgba(27,31,36,0.15)] shadow-sm transition">
                Download Laporan
            </button>
        </div>

        {/* --- STATS GRID (GitHub Style - Data Real & Konteks Bansos) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Kartu 1: Total Akun Terdaftar */}
            <RepoCard 
                title="Total Akun Sistem" 
                count={countTotal} 
                desc="Admin, Surveyor & User" 
                color="bg-slate-500" 
                icon={<FaUsers className="text-slate-400" />}
            />
            
            {/* Kartu 2: Calon Penerima (Role User) */}
            <RepoCard 
                title="Calon Penerima" 
                count={countRecipients} 
                desc="Warga terdaftar" 
                color="bg-blue-500" 
                icon={<FaHandHoldingHeart className="text-slate-400" />}
            />
            
            {/* Kartu 3: Tim Surveyor (Role Survey) */}
            <RepoCard 
                title="Tim Surveyor" 
                count={countSurveyors} 
                desc="Petugas lapangan aktif" 
                color="bg-green-500" 
                icon={<FaMapMarkedAlt className="text-slate-400" />}
            />

            {/* Kartu 4: Status Penyaluran (Simulasi) */}
            <RepoCard 
                title="Target Penyaluran" 
                count="85%" 
                desc="Realisasi bulan ini" 
                color="bg-purple-500" 
                icon={<FaBoxOpen className="text-slate-400" />}
            />
        </div>

        {/* --- ACTIVITY FEED / TABLE (Log Aktivitas Bansos) --- */}
        <div className="border border-gray-300 rounded-md bg-white shadow-sm">
            {/* Header Table */}
            <div className="bg-[#f6f8fa] px-4 py-3 border-b border-gray-300 rounded-t-md flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700">Aktivitas Terbaru</h3>
                <span className="text-xs text-gray-500">Update Terkini</span>
            </div>
            
            {/* List Item (Simulasi Data Bansos) */}
            <div className="divide-y divide-gray-200">
                <ActivityItem 
                    user="Budi Santoso" 
                    role="Surveyor"
                    action="memverifikasi data" 
                    target="Desa Sukamaju" 
                    time="10 menit yang lalu" 
                    msg="Melakukan upload foto kondisi rumah warga." 
                />
                <ActivityItem 
                    user="Siti Aminah" 
                    role="Admin"
                    action="menyetujui" 
                    target="Pengajuan #BW-2024" 
                    time="1 jam yang lalu" 
                    msg="Data valid dan sesuai kriteria penerima bantuan." 
                />
                <ActivityItem 
                    user="Joko Anwar" 
                    role="User"
                    action="mendaftar" 
                    target="Bantuan Tunai" 
                    time="3 jam yang lalu" 
                    msg="Melengkapi berkas KTP dan KK." 
                />
                <ActivityItem 
                    user="Rina Nose" 
                    role="Surveyor"
                    action="melaporkan" 
                    target="Kendala Lapangan" 
                    time="5 jam yang lalu" 
                    msg="Akses jalan menuju lokasi RT 05 terputus banjir." 
                />
            </div>
            
            <div className="p-2 text-center border-t border-gray-200 bg-gray-50 rounded-b-md">
                <button className="text-blue-600 text-sm font-medium hover:underline">Lihat semua log aktivitas</button>
            </div>
        </div>
    </LayoutAdmin>
  );
};

// --- SUB COMPONENTS ---

const RepoCard = ({ title, count, desc, color, icon }) => (
    <div className="bg-white border border-gray-300 rounded-md p-4 hover:border-blue-500 transition cursor-pointer shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                {icon} {title}
            </span>
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-1">{count}</div>
        <div className="text-xs text-gray-500">{desc}</div>
    </div>
);

const ActivityItem = ({ user, role, action, target, time, msg }) => (
    <div className="px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3">
        {/* Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-xs text-gray-600 border border-gray-300">
            {user.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900">
                <span className="font-semibold hover:text-blue-600 cursor-pointer">{user}</span> 
                <span className="text-xs text-gray-500 mx-1">({role})</span>
                <span className="text-gray-600">{action}</span>
                <span className="ml-1 font-mono text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded border border-blue-100">{target}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{msg}</p>
        </div>
        
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
);

export default DashboardAdmin;