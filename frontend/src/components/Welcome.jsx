import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaHandHoldingHeart, FaBoxOpen, FaClipboardCheck, FaSearchLocation, 
    FaArrowRight, FaBullhorn, FaCheckCircle, FaSpinner, FaInfoCircle, 
    FaShieldAlt, FaCommentDots, FaUserSecret, FaPaperPlane, FaTimes, 
    FaMapMarkerAlt, FaExternalLinkAlt
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000'; // Konfigurasi URL Backend

const Welcome = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // State Form
  const [namaPelapor, setNamaPelapor] = useState("");
  const [isiLaporan, setIsiLaporan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efek Scroll Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambil Data Penerima (Preview 5 Data Terakhir)
  useEffect(() => {
    const getRecipients = async () => {
      try {
          const response = await axios.get(`${API_URL}/public/recipients`);
          // Kita hanya ambil 5 data teratas untuk halaman depan agar ringan
          setRecipients(response.data); 
      } catch (error) {
          console.error("Gagal mengambil data", error);
      } finally {
          setLoading(false);
      }
    };
    getRecipients();
  }, []);

  // --- LOGIKA MODAL ---
  const openCommentModal = async (recipient) => {
      setSelectedRecipient(recipient);
      setIsModalOpen(true);
      setLoadingComments(true);
      setNamaPelapor("");
      setIsiLaporan("");

      try {
          const response = await axios.get(`${API_URL}/public/comments/${recipient.id}`);
          setComments(response.data);
      } catch (error) {
          console.error("Gagal ambil komentar:", error);
      } finally {
          setLoadingComments(false);
      }
  };

  const handlePostComment = async (e) => {
      e.preventDefault();
      if(!isiLaporan.trim()) return;

      setIsSubmitting(true);
      try {
          await axios.post(`${API_URL}/public/comments`, {
              nama_pelapor: namaPelapor || "Warga (Anonim)",
              isi_laporan: isiLaporan,
              biodataUuid: selectedRecipient.uuid
          });
          
          // Refresh komentar
          const response = await axios.get(`${API_URL}/public/comments/${selectedRecipient.id}`);
          setComments(response.data);
          setIsiLaporan("");
          // Opsional: Tampilkan notifikasi sukses kecil (Toast)
      } catch (error) {
          alert("Gagal mengirim laporan. Cek koneksi internet anda.");
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* GLOBAL STYLES & ANIMATIONS */}
      <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
                <FaHandHoldingHeart />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Bansos<span className="text-indigo-600">Kita</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Desa</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/transparansi" className="hidden md:block text-slate-600 font-semibold hover:text-indigo-600 text-sm transition">Transparansi</Link>
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-slate-600 font-semibold hover:text-indigo-600 transition text-sm">Masuk</Link>
                <Link to="/register" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/30 transition transform hover:-translate-y-0.5 text-sm">Daftar</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 border border-indigo-100 shadow-sm">
              <FaShieldAlt /> Transparan & Tepat Sasaran
            </span>
          </div>
          <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Penyaluran Bantuan<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600">Lebih Cepat & Adil</span>
          </h1>
          <p className="animate-fade-in-up delay-200 mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem informasi terpadu desa untuk menjamin bantuan sosial sampai kepada warga yang berhak dengan data yang valid dan terbuka.
          </p>
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1">
              Ajukan Sekarang <FaArrowRight className="text-sm" />
            </Link>
            <Link to="/transparansi" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition">
              Cek Data Penerima
            </Link>
          </div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* --- PREVIEW DATA PENERIMA --- */}
      <section className="py-20 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <FaBullhorn className="text-indigo-600" /> Transparansi Publik
                </h2>
                <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
                    Daftar terbaru warga yang telah diverifikasi dan disetujui. Partisipasi Anda penting untuk pengawasan sosial.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
                        <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-600" />
                        <p className="font-medium">Memuat data terbaru...</p>
                    </div>
                ) : recipients.length === 0 ? (
                    <div className="p-20 text-center bg-slate-50">
                        <FaInfoCircle className="mx-auto text-4xl text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Belum Ada Data</h3>
                        <p className="text-slate-500">Data penerima untuk periode ini belum tersedia.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-5">Nama Penerima</th>
                                    <th className="px-6 py-5">Domisili</th>
                                    <th className="px-6 py-5">Jenis Bantuan</th>
                                    <th className="px-6 py-5 text-center">Kontrol Sosial</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* HANYA TAMPILKAN 5 DATA TERATAS DI HALAMAN DEPAN */}
                                {recipients.slice(0, 5).map((item) => (
                                    <tr key={item.uuid} className="hover:bg-indigo-50/30 transition duration-150">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-800 text-base">{item.user?.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">ID: {item.uuid.substring(0,8)}...</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            Desa {item.desa_kelurahan}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                                {item.jenis_bantuan_dipilih}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button 
                                                onClick={() => openCommentModal(item)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-xs font-bold transition shadow-sm group"
                                            >
                                                <FaCommentDots className="group-hover:scale-110 transition-transform" /> 
                                                Cek / Lapor
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* FOOTER TABEL: CALL TO ACTION LIHAT SEMUA */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <FaShieldAlt /> Menampilkan 5 data terbaru.
                    </p>
                    <Link to="/transparansi" className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition">
                        Lihat Seluruh Data Transparansi <FaExternalLinkAlt className="text-xs" />
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* --- MODAL KOMENTAR / LAPORAN --- */}
      {isModalOpen && selectedRecipient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
                  
                  {/* Header Modal */}
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                          <h3 className="text-lg font-bold text-slate-800">Tanggapan Publik</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <FaMapMarkerAlt className="text-indigo-500"/>
                                <span>Penerima: </span>
                                <span className="font-bold text-slate-700 uppercase">{selectedRecipient.user?.name}</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-500 transition"
                      >
                        <FaTimes />
                      </button>
                  </div>

                  {/* Body: List Komentar */}
                  <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] custom-scrollbar space-y-4">
                      {loadingComments ? (
                          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                              <FaSpinner className="animate-spin text-3xl mb-2 text-indigo-500"/>
                              <p className="text-sm">Mengambil data...</p>
                          </div>
                      ) : comments.length === 0 ? (
                          <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl">
                              <FaBullhorn className="mx-auto text-4xl text-slate-200 mb-3"/>
                              <p className="text-slate-500 font-medium">Belum ada laporan.</p>
                              <p className="text-xs text-slate-400 mt-1 px-8">
                                  Jika data ini tidak valid, silakan laporkan di sini.
                              </p>
                          </div>
                      ) : (
                          comments.map((comment) => (
                              <div key={comment.uuid} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                              <FaUserSecret />
                                          </div>
                                          <span className="text-xs font-bold text-slate-700">
                                              {comment.nama_pelapor}
                                          </span>
                                      </div>
                                      <span className="text-[10px] text-slate-400">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                  </div>
                                  <p className="text-sm text-slate-600 leading-relaxed pl-9">
                                      {comment.isi_laporan}
                                  </p>
                              </div>
                          ))
                      )}
                  </div>

                  {/* Footer: Form Input */}
                  <div className="p-4 border-t border-slate-200 bg-white">
                      <form onSubmit={handlePostComment} className="space-y-3">
                          <div className="relative">
                                <FaUserSecret className="absolute top-3 left-3 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Nama Pelapor (Boleh Samaran)" 
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={namaPelapor}
                                    onChange={(e) => setNamaPelapor(e.target.value)}
                                />
                          </div>
                          
                          <div className="flex gap-2">
                              <input 
                                  type="text" 
                                  placeholder="Tulis tanggapan Anda..." 
                                  className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={isiLaporan}
                                  onChange={(e) => setIsiLaporan(e.target.value)}
                              />
                              <button 
                                  type="submit" 
                                  disabled={isSubmitting || !isiLaporan}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                              >
                                  {isSubmitting ? <FaSpinner className="animate-spin"/> : <FaPaperPlane />}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Alur Penerimaan Bantuan</h2>
                <p className="text-slate-500 mt-4 text-lg">Tiga langkah mudah mendapatkan hak bantuan Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <FaClipboardCheck />, title: "1. Registrasi Online", desc: "Buat akun dan lengkapi formulir pengajuan. Upload foto KTP, KK, dan kondisi rumah melalui HP Anda.", color: "blue" },
                    { icon: <FaSearchLocation />, title: "2. Validasi Surveyor", desc: "Tim lapangan akan mengunjungi rumah Anda untuk memverifikasi data dan mengambil foto dokumentasi terbaru.", color: "orange" },
                    { icon: <FaBoxOpen />, title: "3. Penyaluran Bantuan", desc: "Jika disetujui, unduh Bukti Pengambilan Bantuan digital dan cairkan bantuan di Kantor Desa/Bank Penyalur.", color: "green" }
                ].map((step, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className={`w-16 h-16 bg-${step.color}-50 text-${step.color}-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><FaHandHoldingHeart /></div>
                        <h2 className="text-xl font-bold text-white">BansosKita</h2>
                    </div>
                    <p className="text-slate-500 text-sm">© 2025 Digital Desa. All rights reserved.</p>
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    <Link to="/login" className="hover:text-white transition">Masuk</Link>
                    <Link to="/register" className="hover:text-white transition">Daftar</Link>
                    <a href="#" className="hover:text-white transition">Bantuan</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;