import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaSearch, FaClipboardList } from "react-icons/fa";

const SurveyorDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/biodata/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // FILTER
            const pendingTasks = response.data.filter(item => 
                (item.status_pengajuan === 'Menunggu' || item.status_pengajuan === null) && 
                !item.is_surveyed
            );
            
            setTasks(pendingTasks);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LayoutAdmin>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Surveyor</h2>
                <p className="text-slate-500">Daftar warga yang perlu ditinjau lapangan.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* JIKA DATA KOSONG */}
                    {tasks.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                            <div className="text-slate-300 text-6xl mb-4 flex justify-center"><FaClipboardList /></div>
                            <h3 className="text-lg font-bold text-slate-600">Tidak Ada Tugas Pending</h3>
                            <p className="text-slate-400">Semua pengajuan warga sudah disurvey atau belum ada pengajuan baru.</p>
                        </div>
                    )}

                    {/* LOOPING DATA */}
                    {tasks.map(task => (
                        <div key={task.uuid} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{task.user?.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded w-fit mt-1">
                                        NIK: {task.nik}
                                    </p>
                                </div>
                                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Perlu Survey
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <p className="text-sm text-slate-600">
                                    <span className="font-bold text-slate-800 block">Alamat:</span>
                                    {task.alamat_lengkap}
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="font-bold text-slate-800">Desa/Kel:</span> {task.desa_kelurahan}
                                </p>
                            </div>

                            <Link to={`/surveyor/input/${task.uuid}`} className="block-w-full text-center bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold flex items-center justify-center gap-2 transition">
                                <FaMapMarkedAlt /> Mulai Input Survey
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </LayoutAdmin>
    );
};
export default SurveyorDashboard;