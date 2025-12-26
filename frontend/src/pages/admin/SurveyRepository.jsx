import React, { useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getAllBiodata } from "../../features/biodataSlice";
import { Link } from "react-router-dom";
import { FaSearch, FaFileAlt, FaMapMarkerAlt, FaEye } from "react-icons/fa";

const SurveyRepository = () => {
  const dispatch = useDispatch();
  const { biodataList, isLoading, isError, message } = useSelector((state) => state.biodata);

  useEffect(() => {
    dispatch(getAllBiodata());
  }, [dispatch]);

  return (
    <LayoutAdmin>
      {/* --- HEADER --- */}
      <div className="mb-5 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold text-slate-900">Data Masuk (Survey)</h2>
            <p className="text-sm text-slate-500 mt-1">Daftar warga yang telah mengajukan permohonan bantuan.</p>
        </div>
        <button className="bg-[#2da44e] text-white text-sm font-medium px-4 py-2 rounded-md border border-black/10 shadow-sm">
            Export to Excel
        </button>
      </div>

      {isError && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{message}</div>}

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="bg-[#f6f8fa] p-3 border-b border-gray-300 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaSearch className="text-xs" /></span>
                <input type="text" placeholder="Cari NIK atau Nama..." className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="text-xs text-gray-500 font-medium hidden md:block">
                {biodataList.length} pengajuan ditemukan
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3">Pemohon</th>
                        <th className="px-4 py-3">Data Ekonomi</th>
                        <th className="px-4 py-3">Lokasi</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan="4" className="text-center py-8">Loading data...</td></tr>
                    ) : biodataList.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">Belum ada data masuk.</td></tr>
                    ) : (
                        biodataList.map((data) => (
                            <tr key={data.uuid} className="hover:bg-gray-50 transition-colors">
                                {/* Kolom 1: Identitas */}
                                <td className="px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <FaFileAlt className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="font-semibold text-blue-600 hover:underline cursor-pointer">{data.user?.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">NIK: {data.nik}</p>
                                            <div className="flex gap-2 mt-1">
                                                {data.penerima_pkh && <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] border border-purple-200">PKH</span>}
                                                {data.penerima_bpnt && <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] border border-orange-200">BPNT</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Kolom 2: Ekonomi */}
                                <td className="px-4 py-3">
                                    <p className="text-slate-700">{data.pekerjaan}</p>
                                    <p className="text-xs text-gray-500">
                                        Gaji: Rp {data.penghasilan_bulanan?.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-xs text-gray-500">Tanggungan: {data.jumlah_tanggungan} orang</p>
                                </td>

                                {/* Kolom 3: Lokasi */}
                                <td className="px-4 py-3 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                        <span>{data.desa_kelurahan}, {data.kecamatan}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 pl-4">{data.kabupaten}</p>
                                </td>

                                {/* Kolom 4: Aksi */}
                                <td className="px-4 py-3 text-right">
                                    <Link 
                                        to={`/surveys/detail/${data.uuid}`} 
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-xs font-medium hover:bg-white hover:text-blue-600 hover:border-blue-500 transition"
                                    >
                                        <FaEye /> Detail
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default SurveyRepository;