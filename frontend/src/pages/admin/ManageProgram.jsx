import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import axios from "axios";
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaBoxOpen, FaCalendarAlt } from "react-icons/fa";

const ManageProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State Form
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [period, setPeriod] = useState("");

    useEffect(() => {
        getPrograms();
    }, []);

    // 1. Ambil Data Program
    const getPrograms = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/programs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrograms(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Tambah Program Baru
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/programs', {
                nama_program: name, 
                deskripsi: desc, 
                periode: period
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Reset Form & Refresh Data
            setName(""); setDesc(""); setPeriod("");
            alert("Program baru berhasil ditambahkan!");
            getPrograms();
        } catch (error) {
            alert(error.response?.data?.msg || "Gagal menambah program");
        }
    };

    // 3. Ubah Status (Buka/Tutup)
    const toggleStatus = async (uuid, currentStatus, programName) => {
        try {
            const token = localStorage.getItem('token');
            // Optimistic UI Update (Ubah tampilan dulu biar cepat)
            const newPrograms = programs.map(p => 
                p.uuid === uuid ? { ...p, isOpen: !currentStatus } : p
            );
            setPrograms(newPrograms);

            // Kirim ke Backend
            await axios.patch(`http://localhost:5000/programs/${uuid}`, {
                isOpen: !currentStatus
            }, { headers: { Authorization: `Bearer ${token}` } });

        } catch (error) {
            alert("Gagal mengubah status");
            getPrograms(); // Revert jika gagal
        }
    };

    // 4. Hapus Program
    const handleDelete = async (uuid) => {
        if(!window.confirm("Yakin ingin menghapus program ini secara permanen?")) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/programs/${uuid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getPrograms();
        } catch (error) {
            alert("Gagal menghapus program");
        }
    };

    return (
        <LayoutAdmin>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Kelola Program Bantuan</h2>
                <p className="text-slate-500 text-sm">Tambah jenis bantuan baru atau nonaktifkan bantuan yang sudah selesai.</p>
            </div>

            {/* --- BAGIAN 1: FORM TAMBAH PROGRAM --- */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 font-bold text-indigo-800 flex items-center gap-2">
                    <FaPlus /> Tambah Program Baru
                </div>
                <div className="p-6">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nama Program</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Bantuan Beras 10kg" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                value={name} 
                                onChange={(e)=>setName(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Periode</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Januari 2025" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                value={period} 
                                onChange={(e)=>setPeriod(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi Singkat</label>
                            <input 
                                type="text" 
                                placeholder="Keterangan singkat..." 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                value={desc} 
                                onChange={(e)=>setDesc(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition shadow-sm">
                                Simpan
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* --- BAGIAN 2: LIST PROGRAM --- */}
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <FaBoxOpen /> Daftar Program Aktif
            </h3>

            {isLoading ? (
                <div className="text-center py-10 text-slate-500">Loading data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.length === 0 && (
                        <div className="col-span-3 text-center py-10 border-2 border-dashed border-slate-300 rounded-lg text-slate-400">
                            Belum ada program bantuan yang dibuat.
                        </div>
                    )}

                    {programs.map((prog) => (
                        <div key={prog.uuid} className={`border rounded-xl p-5 shadow-sm relative transition-all duration-300 ${prog.isOpen ? 'bg-white border-green-200 ring-1 ring-green-100' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                            
                            {/* Header Kartu */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                    <FaBoxOpen className="text-xl" />
                                </div>
                                {/* Toggle Switch */}
                                <button 
                                    onClick={() => toggleStatus(prog.uuid, prog.isOpen, prog.nama_program)} 
                                    className={`text-3xl transition-colors ${prog.isOpen ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-slate-400'}`}
                                    title={prog.isOpen ? "Nonaktifkan Program" : "Aktifkan Program"}
                                >
                                    {prog.isOpen ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-1">{prog.nama_program}</h3>
                            <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{prog.deskripsi}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-100 w-fit px-2 py-1 rounded">
                                <FaCalendarAlt /> Periode: {prog.periode}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${prog.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {prog.isOpen ? "Aktif" : "Ditutup"}
                                </span>
                                
                                <button 
                                    onClick={() => handleDelete(prog.uuid)} 
                                    className="text-slate-400 hover:text-red-500 text-sm transition flex items-center gap-1"
                                >
                                    <FaTrash /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </LayoutAdmin>
    );
};

export default ManageProgram;