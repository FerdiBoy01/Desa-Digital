import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import axios from "axios";
import { FaPrint, FaArrowLeft, FaFilter } from "react-icons/fa";

const ReportPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
    
    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) navigate("/");
    }, [isError, navigate]);

    // Ambil Data Laporan
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/reports/approved?tahun=${year}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [year]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-serif text-black">
            
            {/* --- CONTROLLER BAR (HILANG SAAT DI PRINT) --- */}
            <div className="max-w-[29.7cm] mx-auto mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
                        <FaArrowLeft /> Kembali ke Dashboard
                    </button>
                    
                    <div className="flex items-center gap-2 border-l pl-4">
                        <FaFilter className="text-slate-400"/>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(e.target.value)}
                            className="border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handlePrint}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2 shadow-lg transition"
                >
                    <FaPrint /> Cetak Laporan (PDF)
                </button>
            </div>

            {/* --- KERTAS A4 LANDSCAPE (AREA CETAK) --- */}
            <div className="bg-white max-w-[29.7cm] min-h-[21cm] mx-auto p-[2cm] shadow-2xl print:shadow-none print:p-0 print:m-0 print:w-full">
                
                {/* 1. KOP SURAT RESMI */}
                <div className="border-b-4 border-double border-black pb-4 mb-6 flex items-center justify-center relative">
                    {/* Logo Kabupaten (Placeholder) */}
                    <div className="absolute left-0 top-0">
                        {/* Ganti src dengan logo kabupaten kamu jika ada */}
                        <div className="w-20 h-24 bg-gray-200 flex items-center justify-center text-xs text-center border border-black">
                           Logo<br/>Kabupaten
                        </div>
                    </div>

                    <div className="text-center w-full px-24">
                        <h3 className="text-xl font-bold uppercase tracking-wide">PEMERINTAH KABUPATEN [NAMA KABUPATEN]</h3>
                        <h2 className="text-2xl font-bold uppercase">KECAMATAN [NAMA KECAMATAN]</h2>
                        <h1 className="text-3xl font-extrabold uppercase">KANTOR KEPALA DESA [NAMA DESA]</h1>
                        <p className="text-sm italic mt-1 font-sans">Jalan Raya Utama No. 123, Desa [Nama Desa], Kode Pos 12345</p>
                    </div>
                </div>

                {/* 2. JUDUL LAPORAN */}
                <div className="text-center mb-8">
                    <h2 className="text-lg font-bold underline uppercase">LAPORAN REALISASI PENYALURAN BANTUAN SOSIAL</h2>
                    <p className="text-sm font-bold">PERIODE TAHUN ANGGARAN {year}</p>
                </div>

                {/* 3. TABEL DATA */}
                {loading ? (
                    <div className="text-center py-10">Memuat Data...</div>
                ) : (
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-gray-200 print:bg-gray-200">
                                <th className="border border-black px-2 py-2 w-10 text-center">No</th>
                                <th className="border border-black px-2 py-2 text-left">Nama Penerima</th>
                                <th className="border border-black px-2 py-2 text-center">NIK</th>
                                <th className="border border-black px-2 py-2 text-center">No. KK</th>
                                <th className="border border-black px-2 py-2 text-left">Alamat (Dusun/RT/RW)</th>
                                <th className="border border-black px-2 py-2 text-center">Jenis Bantuan</th>
                                <th className="border border-black px-2 py-2 text-center">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="border border-black px-4 py-8 text-center italic">
                                        Tidak ada data penerima bantuan yang disetujui pada tahun {year}.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={item.uuid} className="break-inside-avoid">
                                        <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border border-black px-2 py-1 font-bold">{item.user?.name}</td>
                                        <td className="border border-black px-2 py-1 text-center">{item.nik}</td>
                                        <td className="border border-black px-2 py-1 text-center">{item.no_kk}</td>
                                        <td className="border border-black px-2 py-1 capitalize">
                                            {item.alamat_lengkap}, {item.desa_kelurahan}
                                        </td>
                                        <td className="border border-black px-2 py-1 text-center font-bold">{item.jenis_bantuan_dipilih}</td>
                                        <td className="border border-black px-2 py-1 text-center">Disetujui</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {/* 4. TOTAL REKAPITULASI */}
                {!loading && data.length > 0 && (
                    <div className="mt-4 text-sm font-bold">
                        <p>Total Penerima Manfaat: {data.length} Orang</p>
                    </div>
                )}

                {/* 5. TANDA TANGAN (TTD) */}
                <div className="flex justify-end mt-16 break-inside-avoid">
                    <div className="text-center w-64">
                        <p className="mb-2">
                            [Nama Desa], {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                        </p>
                        <p className="font-bold mb-20">Kepala Desa [Nama Desa]</p>
                        
                        <p className="font-bold underline uppercase">( ..................................... )</p>
                        <p>NIP. .....................................</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportPage;