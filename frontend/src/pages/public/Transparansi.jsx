import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaBullhorn, FaUserSecret, FaMapMarkerAlt, 
    FaBoxOpen, FaCommentDots, FaCheckCircle, FaSearch 
} from 'react-icons/fa';

const Transparansi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPublicData();
  }, []);

  const getPublicData = async () => {
      try {
          const response = await axios.get('http://localhost:5000/public/recipients');
          setData(response.data);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  // Filter Pencarian
  const filteredData = data.filter(item => 
      item.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desa_kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* NAVBAR SEDERHANA */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Link to="/" className="text-slate-500 hover:text-indigo-600 transition"><FaArrowLeft /></Link>
                  <h1 className="font-bold text-slate-800 text-lg">Transparansi <span className="text-indigo-600">Publik</span></h1>
              </div>
          </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 text-2xl">
                  <FaBullhorn />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Dinding Transparansi</h2>
              <p className="text-slate-500 mt-2 max-w-xl mx-auto">
                  Berikut adalah daftar penerima bantuan yang telah disetujui beserta tanggapan dari masyarakat.
              </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-md mx-auto mb-10 relative">
              <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
              <input 
                  type="text" 
                  placeholder="Cari nama penerima atau desa..." 
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* LIST DATA */}
          {loading ? (
              <div className="text-center py-20">Loading data...</div>
          ) : filteredData.length === 0 ? (
              <div className="text-center py-20 text-slate-400">Data tidak ditemukan.</div>
          ) : (
              <div className="grid gap-6">
                  {filteredData.map((item) => (
                      <div key={item.uuid} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                          
                          {/* BAGIAN ATAS: INFO PENERIMA */}
                          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50">
                              <div className="flex items-start gap-4">
                                  {/* Avatar Inisial */}
                                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                      {item.user?.name.charAt(0)}
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-slate-800 text-lg">{item.user?.name}</h3>
                                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                                          <span className="flex items-center gap-1"><FaMapMarkerAlt /> {item.desa_kelurahan}</span>
                                          <span className="flex items-center gap-1"><FaBoxOpen /> {item.jenis_bantuan_dipilih}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-green-700 text-xs font-bold self-start md:self-center">
                                  <FaCheckCircle /> Disetujui Admin
                              </div>
                          </div>

                          {/* BAGIAN BAWAH: KOLOM KOMENTAR */}
                          <div className="bg-slate-50/50 p-6">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                  <FaCommentDots className="text-slate-400" /> 
                                  Tanggapan Warga ({item.comments ? item.comments.length : 0})
                              </h4>

                              {item.comments && item.comments.length > 0 ? (
                                  <div className="space-y-3">
                                      {item.comments.map((comment, idx) => (
                                          <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-sm relative">
                                              {/* Icon Segitiga kecil (Speech Bubble) */}
                                              <div className="absolute top-[-6px] left-6 w-3 h-3 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                                              
                                              <div className="flex justify-between items-start mb-1">
                                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                                      <FaUserSecret className="text-slate-400" /> {comment.nama_pelapor}
                                                  </span>
                                                  <span className="text-[10px] text-slate-400">
                                                      {new Date(comment.createdAt).toLocaleDateString()}
                                                  </span>
                                              </div>
                                              <p className="text-slate-600">"{comment.isi_laporan}"</p>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <p className="text-sm text-slate-400 italic pl-1">Belum ada tanggapan untuk penerima ini.</p>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};

export default Transparansi;