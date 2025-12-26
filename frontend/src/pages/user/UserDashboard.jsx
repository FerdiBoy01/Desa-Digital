import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMyBiodata } from "../../features/biodataSlice";
import { LogOut, reset } from "../../features/authSlice";
import axios from "axios";
import { 
    FaSignOutAlt, FaHandHoldingHeart, FaBoxOpen, FaArrowRight, 
    FaCheckCircle, FaExclamationCircle, FaClock,
    FaFileAlt, FaMapMarkedAlt, FaUserCheck, FaFlagCheckered, FaPrint, FaHistory
} from "react-icons/fa";

const UserDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    // Ambil Data
    const { biodata: biodataList, isLoading } = useSelector((state) => state.biodata);
    const [activePrograms, setActivePrograms] = useState([]);
    
    // State lokal
    const [currentData, setCurrentData] = useState(null); 
    const [historyData, setHistoryData] = useState([]);   

    useEffect(() => {
        dispatch(getMyBiodata());
        getActivePrograms();
    }, [dispatch]);

    // --- LOGIC PEMILAHAN DATA ---
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
        let styles = "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 flex-shrink-0 ";
        if (currentStep > stepNumber) styles += "bg-green-600 border-green-600 text-white";
        else if (currentStep === stepNumber) styles += "bg-white border-blue-600 text-blue-600 animate-pulse shadow-lg";
        else styles += "bg-white border-slate-300 text-slate-300";
        return <div className={styles}>{icon}</div>;
    };

    const renderConnector = (stepNumber) => {
        let styles = "absolute left-5 top-10 h-full w-1 -z-0 ";
        if (currentStep > stepNumber) styles += "bg-green-600"; 
        else styles += "bg-slate-200"; 
        return <div className={styles}></div>;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
            {/* NAVBAR */}
            <nav className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><FaHandHoldingHeart /></div>
                        <span className="font-bold text-lg text-slate-800">Bansos<span className="text-indigo-600">Kita</span></span>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 font-medium flex items-center gap-1 hover:text-red-700 transition"><FaSignOutAlt /> Keluar</button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-6 mt-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Halo, {user && user.name}</h1>
                <p className="text-slate-500 mb-8">
                    Periode Aktif: <span className="font-bold text-indigo-600">{new Date().getFullYear()}</span>
                </p>

                {isLoading && <div className="text-center py-10">Loading data...</div>}

                {/* --- SKENARIO 1: SUDAH ADA DATA (TAMPILKAN TIMELINE) --- */}
                {!isLoading && currentData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* KOLOM KIRI: STATUS CARD & TIMELINE */}
                        <div className="md:col-span-2 space-y-6">
                            
                            {/* Card Ringkasan Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden transition hover:shadow-md">
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-xl text-xs font-bold uppercase border-b border-l 
                                    ${currentData.status_pengajuan === 'Disetujui' ? 'bg-green-100 text-green-700 border-green-200' : 
                                      currentData.status_pengajuan === 'Ditolak' ? 'bg-red-100 text-red-700 border-red-200' : 
                                      'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                    {currentData.status_pengajuan}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Program Dipilih:</h3>
                                <p className="text-2xl font-bold text-indigo-600 my-1">{currentData.jenis_bantuan_dipilih}</p>
                                <p className="text-sm text-slate-500 mb-4">Update Terakhir: {new Date(currentData.updatedAt).toLocaleDateString()}</p>
                                
                                {/* --- PERBAIKAN 1: TOMBOL MUNCUL DISINI --- */}
                                {currentData.status_pengajuan === 'Disetujui' && (
                                    <button 
                                        onClick={() => navigate('/cetak-bukti')}
                                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition animate-bounce-slow"
                                    >
                                        <FaPrint /> Cetak Bukti Pengambilan
                                    </button>
                                )}

                                {currentData.status_pengajuan === 'Menunggu' && (
                                    <Link to="/pengajuan/form" className="text-sm font-bold text-indigo-600 hover:underline">
                                        Lihat Detail Data Anda &rarr;
                                    </Link>
                                )}
                            </div>

                            {/* TIMELINE */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 border-b pb-2">Alur Proses Pengajuan</h3>
                                <div className="space-y-0 relative">

                                    {/* STEP 1 */}
                                    <div className="flex gap-4 relative pb-10">
                                        {renderConnector(1)}
                                        {renderStepIcon(1, <FaFileAlt />)}
                                        <div>
                                            <h4 className={`font-bold ${currentStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Pengajuan Data Masuk</h4>
                                            <p className="text-sm text-slate-500">Data diri dan dokumen telah diterima sistem.</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(currentData.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* STEP 2 */}
                                    <div className="flex gap-4 relative pb-10">
                                        {renderConnector(2)}
                                        {renderStepIcon(2, <FaMapMarkedAlt />)}
                                        <div>
                                            <h4 className={`font-bold ${currentStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Survey Lapangan</h4>
                                            {currentData.is_surveyed ? (
                                                <div className="bg-green-50 border border-green-100 p-3 rounded-lg mt-2">
                                                    <p className="text-sm text-green-800 font-bold flex items-center gap-2"><FaCheckCircle/> Sudah Disurvey</p>
                                                    <p className="text-xs text-green-700 mt-1">Oleh Petugas: {currentData.nama_surveyor}</p>
                                                    <p className="text-xs text-green-700 font-mono">Tanggal: {currentData.tgl_survey}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 mt-1 bg-yellow-50 p-2 rounded border border-yellow-100">
                                                    <span className="text-orange-600 font-bold flex items-center gap-1"><FaClock/> Menunggu Kunjungan.</span>
                                                    Tim Surveyor akan datang ke alamat domisili untuk verifikasi.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* STEP 3 */}
                                    <div className="flex gap-4 relative pb-10">
                                        {renderConnector(3)}
                                        {renderStepIcon(3, <FaUserCheck />)}
                                        <div>
                                            <h4 className={`font-bold ${currentStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Verifikasi Akhir Admin</h4>
                                            <p className="text-sm text-slate-500">Admin mencocokkan data pengajuan dengan hasil survey lapangan.</p>
                                        </div>
                                    </div>

                                    {/* STEP 4 */}
                                    <div className="flex gap-4 relative">
                                        {renderStepIcon(4, <FaFlagCheckered />)}
                                        <div className="w-full">
                                            <h4 className={`font-bold ${currentStep >= 4 ? 'text-slate-800' : 'text-slate-400'}`}>Keputusan Akhir</h4>
                                            
                                            {currentData.status_pengajuan === 'Disetujui' && (
                                                <div className="mt-3 bg-green-50 border border-green-200 p-4 rounded-xl">
                                                    <p className="text-green-700 font-bold mb-3 flex items-center gap-2">
                                                        <FaCheckCircle className="text-xl"/> Selamat! Pengajuan Anda DISETUJUI.
                                                    </p>
                                                    
                                                    {/* --- PERBAIKAN 2: TOMBOL MUNCUL JUGA DISINI --- */}
                                                    <button 
                                                        onClick={() => navigate('/cetak-bukti')}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
                                                    >
                                                        <FaPrint /> Cetak Bukti Pengambilan
                                                    </button>
                                                    
                                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                                        *Harap cetak dokumen ini dan bawa ke Kantor Desa/Bank Penyalur.
                                                    </p>
                                                </div>
                                            )}

                                            {currentData.status_pengajuan === 'Ditolak' && (
                                                <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded">
                                                    <p className="text-red-700 font-bold flex items-center gap-2"><FaExclamationCircle/> Mohon Maaf, Pengajuan DITOLAK.</p>
                                                    <p className="text-xs text-red-600 mt-1">Silakan hubungi kantor desa untuk info lebih lanjut.</p>
                                                </div>
                                            )}

                                            {currentData.status_pengajuan === 'Menunggu' && (
                                                <p className="text-sm text-slate-400 mt-1">Menunggu keputusan resmi dari Admin.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: INFO LAIN */}
                        <div className="space-y-4">
                             {/* Kotak Catatan Admin */}
                             {currentData.catatan_admin && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold">
                                        <FaExclamationCircle /> Pesan Petugas
                                    </div>
                                    <p className="text-sm text-slate-700 italic">"{currentData.catatan_admin}"</p>
                                </div>
                            )}

                            {/* Ringkasan Dokumen */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <h4 className="font-bold text-slate-700 mb-3 text-sm">Dokumen Terupload</h4>
                                <ul className="text-xs text-slate-500 space-y-2">
                                    <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> KTP & KK</li>
                                    <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Foto Rumah</li>
                                </ul>
                            </div>

                            {/* INFO PERIODE */}
                             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
                                <strong>Info:</strong> Anda sudah mengajukan untuk periode {currentData.tahun_periode}.
                            </div>
                        </div>

                    </div>
                )}

                {/* SKENARIO 2: BELUM ADA DATA (TAMPILKAN KATALOG) */}
                {!isLoading && !currentData && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FaBoxOpen className="text-indigo-600"/> Program Bantuan {new Date().getFullYear()}
                        </h2>
                        
                        {activePrograms.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                                <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-2"/>
                                <p className="text-gray-400 font-medium">Belum ada program bantuan yang dibuka saat ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activePrograms.map((program) => (
                                    <div key={program.uuid} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
                                        <div className="h-2 bg-indigo-500 group-hover:bg-indigo-600 transition"></div>
                                        <div className="p-6">
                                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded mb-3 inline-block uppercase tracking-wider">
                                                Periode: {program.periode}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{program.nama_program}</h3>
                                            <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{program.deskripsi}</p>
                                            
                                            <button onClick={() => applyProgram(program.nama_program)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition transform active:scale-[0.98]">
                                                Ajukan Sekarang <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- BAGIAN 2: HISTORI PENGAJUAN (TAHUN LALU) --- */}
                {historyData.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-300">
                        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <FaHistory /> Riwayat Pengajuan Terdahulu
                        </h3>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {historyData.map((hist) => (
                                        <tr key={hist.uuid}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hist.tahun_periode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hist.jenis_bantuan_dipilih}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${hist.status_pengajuan === 'Disetujui' ? 'bg-green-100 text-green-800' : 
                                                      hist.status_pengajuan === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {hist.status_pengajuan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(hist.createdAt).toLocaleDateString()}</td>
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