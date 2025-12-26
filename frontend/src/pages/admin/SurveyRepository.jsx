import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getAllBiodata } from "../../features/biodataSlice";
import { Link } from "react-router-dom";
import { 
    FaSearch, FaFileAlt, FaMapMarkerAlt, FaEye, 
    FaCheckCircle, FaTimesCircle, FaMapMarkedAlt, 
    FaChevronLeft, FaChevronRight, FaFilter, 
    FaExclamationTriangle
} from "react-icons/fa";

const SurveyRepository = () => {
  const dispatch = useDispatch();
  const { biodataList, isLoading, isError, message } = useSelector((state) => state.biodata);

  // --- STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 

  useEffect(() => {
    dispatch(getAllBiodata());
  }, [dispatch]);

  // --- LOGIKA FILTER ---
  const filteredData = biodataList ? biodataList.filter((item) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch = (
          item.user?.name.toLowerCase().includes(lowerSearch) ||
          item.nik.includes(lowerSearch)
      );

      let matchStatus = true;
      if (filterStatus === 'perlu_survey') {
          matchStatus = item.status_pengajuan === 'Menunggu' && !item.is_surveyed;
      } else if (filterStatus === 'siap_verifikasi') {
          matchStatus = item.status_pengajuan === 'Menunggu' && item.is_surveyed;
      } else if (filterStatus === 'disetujui') {
          matchStatus = item.status_pengajuan === 'Disetujui';
      } else if (filterStatus === 'ditolak') {
          matchStatus = item.status_pengajuan === 'Ditolak';
      }

      return matchSearch && matchStatus;
  }) : [];

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); 
  };

  const handleFilterChange = (status) => {
      setFilterStatus(status);
      setCurrentPage(1);
  };

  // --- LOGIKA BADGE STATUS (DIPERBARUI) ---
  const getStatusBadge = (data) => {
    if (data.comments && data.comments.length > 0) {
        return (
            <div className="flex flex-col items-start gap-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white border border-red-700 animate-pulse shadow-sm">
                    <FaExclamationTriangle className="text-yellow-300" /> {data.comments.length} Laporan
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                    Status: {data.status_pengajuan}
                </span>
            </div>
        );
    }

    // ... Logika Status Biasa ...
    if (data.status_pengajuan === 'Disetujui') {
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><FaCheckCircle /> Disetujui</span>;
    }
    if (data.status_pengajuan === 'Ditolak') {
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200"><FaTimesCircle /> Ditolak</span>;
    }
    if (data.is_surveyed) {
        return (
            <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 animate-pulse"><FaCheckCircle /> Siap Verifikasi</span>
                <p className="text-[10px] text-gray-500 mt-1 ml-1">Surveyor: {data.nama_surveyor}</p>
            </div>
        );
    } else {
        return (
            <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200"><FaMapMarkedAlt /> Perlu Survey</span>
                <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">Belum dikunjungi</p>
            </div>
        );
    }
  };

  const TabButton = ({ label, value, icon, colorClass }) => (
      <button
          onClick={() => handleFilterChange(value)}
          className={`px-4 py-2 text-sm font-bold rounded-full transition flex items-center gap-2 border
          ${filterStatus === value 
              ? `${colorClass} text-white shadow-md border-transparent` 
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
      >
          {icon} {label}
      </button>
  );

  return (
    <LayoutAdmin>
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold text-slate-900">Data Masuk (Survey)</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola data pengajuan bantuan warga.</p>
        </div>
        <button className="bg-[#2da44e] text-white text-sm font-medium px-4 py-2 rounded-md border border-black/10 shadow-sm hover:bg-[#2c974b] transition">
            Export to Excel
        </button>
      </div>

      {isError && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{message}</div>}

      {/* --- FILTER TABS --- */}
      <div className="flex flex-wrap gap-3 mb-6">
          <TabButton label="Semua Data" value="all" icon={<FaFilter />} colorClass="bg-slate-700" />
          <TabButton label="Perlu Survey" value="perlu_survey" icon={<FaMapMarkedAlt />} colorClass="bg-orange-500" />
          <TabButton label="Siap Verifikasi" value="siap_verifikasi" icon={<FaCheckCircle />} colorClass="bg-blue-600" />
          <TabButton label="Disetujui" value="disetujui" icon={<FaCheckCircle />} colorClass="bg-green-600" />
          <TabButton label="Ditolak" value="ditolak" icon={<FaTimesCircle />} colorClass="bg-red-600" />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        
        {/* Search Bar */}
        <div className="bg-[#f6f8fa] p-3 border-b border-gray-300 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaSearch className="text-xs" /></span>
                <input 
                    type="text" 
                    placeholder="Cari NIK atau Nama..." 
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleSearch} 
                />
            </div>
            <div className="text-xs text-gray-500 font-bold hidden md:block">
                Menampilkan: {filteredData.length} Data
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3">Pemohon</th>
                        <th className="px-4 py-3">Data Ekonomi</th>
                        <th className="px-4 py-3">Lokasi</th>
                        <th className="px-4 py-3">Status & Progres</th> 
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan="5" className="text-center py-8">Loading data...</td></tr>
                    ) : currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-12 text-gray-500 flex flex-col items-center justify-center">
                                <FaFilter className="text-4xl text-gray-200 mb-2" />
                                <p>Tidak ada data ditemukan pada kategori ini.</p>
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((data) => (
                            <tr key={data.uuid} className="hover:bg-gray-50 transition-colors">
                                {/* Kolom 1: Identitas */}
                                <td className="px-4 py-3 align-top">
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
                                <td className="px-4 py-3 align-top">
                                    <p className="text-slate-700 font-medium">{data.pekerjaan}</p>
                                    <p className="text-xs text-gray-500">
                                        Gaji: Rp {data.penghasilan_bulanan?.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-xs text-gray-500">Tanggungan: {data.jumlah_tanggungan} orang</p>
                                </td>

                                {/* Kolom 3: Lokasi */}
                                <td className="px-4 py-3 text-gray-600 align-top">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                        <span className="font-medium text-gray-700">{data.desa_kelurahan}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 pl-4">{data.kecamatan}, {data.kabupaten}</p>
                                </td>

                                {/* Kolom 4: STATUS (Dengan Indikator Laporan) */}
                                <td className="px-4 py-3 align-top">
                                    {getStatusBadge(data)}
                                </td>

                                {/* Kolom 5: Aksi */}
                                <td className="px-4 py-3 text-right align-top">
                                    <Link 
                                        to={`/surveys/detail/${data.uuid}`} 
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 text-xs font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition shadow-sm"
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

        {/* --- PAGINATION CONTROLS --- */}
        {!isLoading && filteredData.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-gray-700">
                            Menampilkan <span className="font-medium">{indexOfFirstItem + 1}</span> - <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className="h-3 w-3" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-xs font-medium 
                                        ${currentPage === i + 1 
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className="h-3 w-3" />
                            </button>
                        </nav>
                    </div>
                </div>
                 {/* Mobile Pagination */}
                 <div className="flex items-center justify-between sm:hidden w-full">
                     <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded text-xs">Prev</button>
                     <span className="text-xs">Hal {currentPage} / {totalPages}</span>
                     <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded text-xs">Next</button>
                </div>
            </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default SurveyRepository;