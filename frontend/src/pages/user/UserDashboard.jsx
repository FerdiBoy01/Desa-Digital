import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMyBiodata } from "../../features/biodataSlice";
import { LogOut, reset } from "../../features/authSlice";
import axios from "axios";
import { 
    FaSignOutAlt, FaHandHoldingHeart, FaBoxOpen, FaArrowRight, 
    FaCheckCircle, FaExclamationCircle, FaClock,
    FaFileAlt, FaMapMarkedAlt, FaUserCheck, FaFlagCheckered, 
    FaPrint, FaHistory, FaWhatsapp // Tambahkan Icon WA
} from "react-icons/fa";

const UserDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    const { biodata: biodataList, isLoading } = useSelector((state) => state.biodata);
    const [activePrograms, setActivePrograms] = useState([]);
    
    const [currentData, setCurrentData] = useState(null); 
    const [historyData, setHistoryData] = useState([]);   

    useEffect(() => {
        dispatch(getMyBiodata());
        getActivePrograms();
    }, [dispatch]);

    useEffect(() => {
        if (biodataList && Array.isArray(biodataList)) {
            const thisYear = new Date().getFullYear().toString();
            const active = biodataList.find(item => item.tahun_periode === thisYear);
            const history = biodataList.filter(item => item.tahun_periode !== thisYear);
            setCurrentData(active);
            setHistoryData(history);
        } else if (biodataList && !Array.isArray(biodataList)) {
             setCurrentData(biodataList);
        }
    }, [biodataList]);

    const getActivePrograms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/programs/active', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivePrograms(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };

    const applyProgram = (programName) => {
        localStorage.setItem("selectedProgram", programName);
        navigate("/pengajuan/form");
    };

    // --- HELPER TIMELINE ---
    const getCurrentStep = (data) => {
        if (!data) return 0;
        if (data.status_pengajuan === 'Disetujui' || data.status_pengajuan === 'Ditolak') return 4;
        if (data.is_surveyed) return 3; 
        return 2; 
    };

    const currentStep = getCurrentStep(currentData);

    const renderStepIcon = (stepNumber, icon) => {
        let styles = "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 flex-shrink-0 transition-all duration-300 ";
        if (currentStep > stepNumber) styles += "bg-green-600 border-green-600 text-white";
        else if (currentStep === stepNumber) styles += "bg-white border-indigo-600 text-indigo-600 animate-pulse shadow-lg scale-110";
        else styles += "bg-white border-slate-300 text-slate-300";
        return <div className={styles}>{icon}</div>;
    };

    const renderConnector = (stepNumber) => {
        let styles = "absolute left-5 top-10 h-full w-0.5 -z-0 ";
        if (currentStep > stepNumber) styles += "bg-green-600"; 
        else styles += "bg-slate-200"; 
        return <div className={styles}></div>;
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
            {/* NAVBAR */}
            <nav className="bg-white shadow-sm border-b border-slate-100 px-4 py-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg shadow-indigo-200 shadow-lg">
                            <FaHandHoldingHeart />
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">Bansos<span className="text-indigo-600">Kita</span></span>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 font-semibold text-sm flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                        <FaSignOutAlt /> Keluar
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 mt-6">
                
                {/* HEADER SECTION */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Halo, {user && user.name}</h1>
                    <p className="text-slate-500 font-medium">
                        Periode Aktif: <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-bold">{new Date().getFullYear()}</span>
                    </p>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* --- SKENARIO 1: SUDAH MENGAJUKAN (TAMPILKAN STATUS & TIMELINE) --- */}
                {!isLoading && currentData && (
                    <div className="animate-fade-in-up">
                        
                        {/* 🔥 NEW FEATURE: NOTIFIKASI WHATSAPP BANNER 🔥 */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-sm">
                            <div className="bg-green-500 text-white p-3 rounded-full shadow-green-200 shadow-md">
                                <FaWhatsapp className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-green-800 font-bold text-lg">Informasi Penting!</h3>
                                <p className="text-green-700 text-sm mt-1 leading-relaxed">
                                    Anda tidak perlu memantau halaman ini terus-menerus. 
                                    <strong> Hasil keputusan (Disetujui/Ditolak)</strong> akan dikirimkan secara otomatis melalui <strong>WhatsApp</strong> ke nomor yang Anda daftarkan.
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-semibold bg-white/50 px-3 py-1 rounded-lg w-fit">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Sistem Notifikasi Aktif
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* KOLOM KIRI: TIMELINE & STATUS */}
                            <div className="md:col-span-2 space-y-8">
                                
                                {/* Status Card */}
                                <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-slate-100 p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Program Diikuti</p>
                                            <h3 className="text-2xl font-bold text-slate-800">{currentData.jenis_bantuan_dipilih}</h3>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-2
                                            ${currentData.status_pengajuan === 'Disetujui' ? 'bg-green-50 text-green-700 border-green-200' : 
                                              currentData.status_pengajuan === 'Ditolak' ? 'bg-red-50 text-red-700 border-red-200' : 
                                              'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                            <span className={`w-2 h-2 rounded-full ${currentData.status_pengajuan === 'Disetujui' ? 'bg-green-500' : currentData.status_pengajuan === 'Ditolak' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                            {currentData.status_pengajuan}
                                        </div>
                                    </div>

                                    {currentData.status_pengajuan === 'Disetujui' && (
                                        <button 
                                            onClick={() => navigate('/cetak-bukti')}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold shadow-indigo-200 shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-1"
                                        >
                                            <FaPrint /> Cetak Bukti Pengambilan
                                        </button>
                                    )}
                                </div>

                                {/* Timeline */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                                    <h3 className="font-bold text-lg text-slate-800 mb-8 flex items-center gap-2">
                                        <FaHistory className="text-indigo-500"/> Jejak Pengajuan
                                    </h3>
                                    <div className="space-y-0 relative pl-2">

                                        {/* STEP 1 */}
                                        <div className="flex gap-6 relative pb-12 group">
                                            {renderConnector(1)}
                                            {renderStepIcon(1, <FaFileAlt />)}
                                            <div>
                                                <h4 className={`font-bold text-base ${currentStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Pengajuan Data Masuk</h4>
                                                <p className="text-sm text-slate-500 mt-1">Data diri dan dokumen telah diterima sistem.</p>
                                                <p className="text-xs text-slate-400 mt-1">{new Date(currentData.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* STEP 2 */}
                                        <div className="flex gap-6 relative pb-12 group">
                                            {renderConnector(2)}
                                            {renderStepIcon(2, <FaMapMarkedAlt />)}
                                            <div>
                                                <h4 className={`font-bold text-base ${currentStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Survey Lapangan</h4>
                                                {currentData.is_surveyed ? (
                                                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl mt-3 shadow-sm">
                                                        <p className="text-sm text-green-800 font-bold flex items-center gap-2"><FaCheckCircle/> Sudah Disurvey</p>
                                                        <p className="text-xs text-green-700 mt-1">Oleh Petugas: {currentData.nama_surveyor}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                                        Menunggu Tim Surveyor mengunjungi lokasi Anda.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* STEP 3 */}
                                        <div className="flex gap-6 relative pb-12 group">
                                            {renderConnector(3)}
                                            {renderStepIcon(3, <FaUserCheck />)}
                                            <div>
                                                <h4 className={`font-bold text-base ${currentStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Verifikasi Akhir Admin</h4>
                                                <p className="text-sm text-slate-500 mt-1">Admin memvalidasi kecocokan data sistem & lapangan.</p>
                                            </div>
                                        </div>

                                        {/* STEP 4 */}
                                        <div className="flex gap-6 relative group">
                                            {renderStepIcon(4, <FaFlagCheckered />)}
                                            <div className="w-full">
                                                <h4 className={`font-bold text-base ${currentStep >= 4 ? 'text-slate-800' : 'text-slate-400'}`}>Keputusan Akhir</h4>
                                                
                                                {currentData.status_pengajuan === 'Disetujui' && (
                                                    <div className="mt-4 bg-green-50 border border-green-200 p-5 rounded-xl animate-pulse-slow">
                                                        <p className="text-green-800 font-bold mb-1 text-lg">Selamat! Pengajuan DISETUJUI.</p>
                                                        <p className="text-sm text-green-700">Silakan cetak bukti pengambilan di atas.</p>
                                                    </div>
                                                )}

                                                {currentData.status_pengajuan === 'Ditolak' && (
                                                    <div className="mt-4 bg-red-50 border border-red-200 p-5 rounded-xl">
                                                        <p className="text-red-800 font-bold text-lg">Mohon Maaf, Pengajuan DITOLAK.</p>
                                                        <p className="text-sm text-red-700 mt-1">Silakan hubungi kantor desa.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN */}
                            <div className="space-y-6">
                                {currentData.catatan_admin && (
                                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-orange-700 font-bold">
                                            <FaExclamationCircle /> Pesan Petugas
                                        </div>
                                        <p className="text-sm text-slate-700 italic leading-relaxed bg-white p-3 rounded-lg border border-orange-100">
                                            "{currentData.catatan_admin}"
                                        </p>
                                    </div>
                                )}

                                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-4">Ringkasan Berkas</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg bg-slate-50">
                                            <FaCheckCircle className="text-green-500" /> KTP & Kartu Keluarga
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg bg-slate-50">
                                            <FaCheckCircle className="text-green-500" /> Foto Rumah (Depan)
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg bg-slate-50">
                                            <FaCheckCircle className="text-green-500" /> Data Penghasilan
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SKENARIO 2: BELUM ADA DATA (DESAIN KARTU BARU SESUAI GAMBAR) --- */}
                {!isLoading && !currentData && (
                    <div className="mb-10 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-6">
                            <FaBoxOpen className="text-indigo-600 text-xl"/>
                            <h2 className="text-xl font-bold text-slate-800">Program Bantuan {new Date().getFullYear()}</h2>
                        </div>
                        
                        {activePrograms.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <FaBoxOpen className="text-5xl text-slate-300 mx-auto mb-4"/>
                                <p className="text-slate-500 font-medium">Belum ada program bantuan yang dibuka saat ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {activePrograms.map((program) => (
                                    /* 🔥 REDESIGN KARTU AGAR SESUAI REFERENSI GAMBAR 🔥 */
                                    <div key={program.uuid} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        
                                        {/* Top Border seperti di gambar */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>

                                        <div className="p-6 pt-8 flex flex-col h-full">
                                            {/* Badge Periode */}
                                            <div className="mb-3">
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded md:rounded-sm uppercase tracking-wider">
                                                    PERIODE: {program.periode || new Date().getFullYear()}
                                                </span>
                                            </div>

                                            {/* Judul & Deskripsi */}
                                            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                                                {program.nama_program}
                                            </h3>
                                            <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                                                {program.deskripsi}
                                            </p>
                                            
                                            {/* Tombol Ajukan */}
                                            <button 
                                                onClick={() => applyProgram(program.nama_program)} 
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                                            >
                                                Ajukan Sekarang <FaArrowRight className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- HISTORI PENGAJUAN --- */}
                {historyData.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <FaHistory className="text-slate-400"/> Riwayat Pengajuan Terdahulu
                        </h3>
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Periode</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {historyData.map((hist) => (
                                        <tr key={hist.uuid} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-900">{hist.tahun_periode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{hist.jenis_bantuan_dipilih}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                                                    ${hist.status_pengajuan === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                                                      hist.status_pengajuan === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {hist.status_pengajuan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(hist.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;