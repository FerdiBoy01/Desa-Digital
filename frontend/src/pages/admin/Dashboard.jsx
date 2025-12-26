import React, { useEffect, useMemo } from 'react';
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import { useDispatch, useSelector } from "react-redux";
import { getUsers, userSelectors } from "../../features/userSlice";
import { getAllBiodata } from "../../features/biodataSlice";
import { Link } from 'react-router-dom';
import { 
    FaUsers, FaHandHoldingHeart, FaClipboardCheck, FaMapMarkedAlt, 
    FaBoxOpen, FaCheckCircle, FaSpinner, FaTimesCircle, FaArrowRight 
} from "react-icons/fa";

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  
  // 1. Ambil Data Users
  const users = useSelector(userSelectors.selectAll);
  
  // 2. Ambil Data Biodata (Survey/Pengajuan)
  const { biodataList, isLoading } = useSelector((state) => state.biodata);
  
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getAllBiodata());
  }, [dispatch]);

  // --- LOGIKA HITUNG STATISTIK (Memoized biar ringan) ---
  const stats = useMemo(() => {
      // User Stats
      const totalUserWarga = users.filter(u => u.role === 'user').length;
      const totalSurveyor = users.filter(u => u.role === 'surveyor' || u.role === 'survey').length;

      // Biodata Stats (Pengajuan)
      const totalPengajuan = biodataList ? biodataList.length : 0;
      const disetujui = biodataList ? biodataList.filter(b => b.status_pengajuan === 'Disetujui').length : 0;
      const ditolak = biodataList ? biodataList.filter(b => b.status_pengajuan === 'Ditolak').length : 0;
      const menunggu = biodataList ? biodataList.filter(b => b.status_pengajuan === 'Menunggu').length : 0;
      
      // Progres Survey (Berapa yg sudah dikunjungi surveyor?)
      const sudahDisurvey = biodataList ? biodataList.filter(b => b.is_surveyed).length : 0;
      const belumDisurvey = totalPengajuan - sudahDisurvey;

      // Hitung Persentase Realisasi
      const persentaseDisetujui = totalPengajuan > 0 ? Math.round((disetujui / totalPengajuan) * 100) : 0;

      return {
          totalUserWarga,
          totalSurveyor,
          totalPengajuan,
          disetujui,
          ditolak,
          menunggu,
          sudahDisurvey,
          belumDisurvey,
          persentaseDisetujui
      };
  }, [users, biodataList]);

  // Ambil 5 Data Terakhir untuk Activity Feed
  const recentActivity = biodataList 
    ? [...biodataList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5) 
    : [];

  return (
    <LayoutAdmin>
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Utama</h2>
                <p className="text-sm text-slate-500 mt-1">Ringkasan data penyaluran bantuan sosial terkini.</p>
            </div>
            <div className="flex gap-2">
                <Link to="/admin/laporan" className="bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-md border border-slate-300 shadow-sm transition">
                    Lihat Laporan
                </Link>
                <Link to="/surveys" className="bg-[#2da44e] hover:bg-[#2c974b] text-white text-sm font-medium px-4 py-2 rounded-md border border-transparent shadow-sm transition">
                    Kelola Pengajuan
                </Link>
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Kartu 1: Total Pengajuan */}
            <RepoCard 
                title="Total Pengajuan" 
                count={stats.totalPengajuan} 
                desc="Data masuk sistem" 
                color="bg-blue-500" 
                icon={<FaClipboardCheck className="text-blue-500" />}
            />
            
            {/* Kartu 2: Sudah Disurvey */}
            <RepoCard 
                title="Sudah Disurvey" 
                count={stats.sudahDisurvey} 
                desc="Diverifikasi lapangan" 
                color="bg-orange-500" 
                icon={<FaMapMarkedAlt className="text-orange-500" />}
            />
            
            {/* Kartu 3: Penerima Bantuan (Disetujui) */}
            <RepoCard 
                title="Penerima Sah" 
                count={stats.disetujui} 
                desc="Disetujui Admin" 
                color="bg-green-500" 
                icon={<FaCheckCircle className="text-green-500" />}
            />

            {/* Kartu 4: Persentase Realisasi */}
            <RepoCard 
                title="Realisasi Bantuan" 
                count={`${stats.persentaseDisetujui}%`} 
                desc="Tingkat Kelulusan" 
                color="bg-purple-500" 
                icon={<FaBoxOpen className="text-purple-500" />}
            />
        </div>

        {/* --- SECTION 2: Grafik Sederhana & Status --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* KOLOM KIRI: STATUS BREAKDOWN */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 lg:col-span-1">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaHandHoldingHeart /> Status Pengajuan
                </h3>
                
                <div className="space-y-4">
                    {/* Menunggu */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Menunggu Proses</span>
                            <span className="font-bold text-slate-800">{stats.menunggu}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(stats.menunggu/stats.totalPengajuan)*100}%` }}></div>
                        </div>
                    </div>

                    {/* Disetujui */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Disetujui</span>
                            <span className="font-bold text-green-600">{stats.disetujui}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(stats.disetujui/stats.totalPengajuan)*100}%` }}></div>
                        </div>
                    </div>

                    {/* Ditolak */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Ditolak</span>
                            <span className="font-bold text-red-600">{stats.ditolak}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(stats.ditolak/stats.totalPengajuan)*100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-xs text-gray-500">
                    <p>Total Warga Terdaftar: <b>{stats.totalUserWarga}</b></p>
                    <p>Total Surveyor Aktif: <b>{stats.totalSurveyor}</b></p>
                </div>
            </div>

            {/* KOLOM KANAN: AKTIVITAS TERBARU (DATA REAL) */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2 flex flex-col">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700">Aktivitas Pengajuan Terbaru</h3>
                    <Link to="/surveys" className="text-xs text-blue-600 hover:underline">Lihat Semua</Link>
                </div>
                
                <div className="divide-y divide-gray-100 flex-1 overflow-auto">
                    {recentActivity.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">Belum ada aktivitas pengajuan.</div>
                    ) : (
                        recentActivity.map((item) => (
                            <ActivityItem key={item.uuid} data={item} />
                        ))
                    )}
                </div>
            </div>
        </div>
    </LayoutAdmin>
  );
};

// --- SUB COMPONENTS ---

const RepoCard = ({ title, count, desc, color, icon }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition shadow-sm flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
            <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
                <div className="text-3xl font-extrabold text-slate-800">{count}</div>
            </div>
            <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('bg-', 'bg-opacity-10 bg-')} `}>
                <div className="text-xl">{icon}</div>
            </div>
        </div>
        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
             <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{desc}</span>
        </div>
    </div>
);

// Komponen Item Aktivitas (Cerdas mendeteksi status)
const ActivityItem = ({ data }) => {
    let statusColor = "bg-gray-100 text-gray-600";
    let statusText = data.status_pengajuan;
    let message = "Pengajuan baru masuk.";

    if (data.status_pengajuan === 'Disetujui') {
        statusColor = "bg-green-100 text-green-700 border-green-200";
        message = `Disetujui. ${data.catatan_admin ? `Catatan: "${data.catatan_admin}"` : ''}`;
    } else if (data.status_pengajuan === 'Ditolak') {
        statusColor = "bg-red-100 text-red-700 border-red-200";
        message = "Pengajuan ditolak oleh Admin.";
    } else if (data.is_surveyed) {
        statusColor = "bg-blue-100 text-blue-700 border-blue-200";
        statusText = "Sudah Disurvey";
        message = `Disurvey oleh ${data.nama_surveyor}. Menunggu verifikasi admin.`;
    }

    return (
        <div className="px-4 py-3 hover:bg-slate-50 transition flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-600">
                {data.user?.name ? data.user.name.charAt(0).toUpperCase() : '?'}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-800 truncate">
                        {data.user?.name}
                    </p>
                    <span className="text-[10px] text-gray-400">
                        {new Date(data.updatedAt).toLocaleDateString('id-ID')}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColor} font-bold`}>
                        {statusText}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        - {data.jenis_bantuan_dipilih}
                    </span>
                </div>
                
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                    "{message}"
                </p>
            </div>
            
            <Link to={`/surveys/detail/${data.uuid}`} className="self-center text-gray-400 hover:text-blue-600">
                <FaArrowRight />
            </Link>
        </div>
    );
};

export default DashboardAdmin;