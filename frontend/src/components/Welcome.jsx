import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaHandHoldingHeart, FaBoxOpen, FaClipboardCheck, FaSearchLocation, 
    FaArrowRight, FaBullhorn, FaCheckCircle, FaSpinner, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa';

const Welcome = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Efek Navbar Transparan ke Solid saat scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambil Data Penerima
  useEffect(() => {
    getRecipients();
  }, []);

  const getRecipients = async () => {
    try {
        // Pastikan endpoint backend '/public/recipients' sudah dibuat sesuai instruksi sebelumnya
        const response = await axios.get('http://localhost:5000/public/recipients');
        setRecipients(response.data);
    } catch (error) {
        console.error("Gagal mengambil data", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* INJECT CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* --- NAVBAR (Glassmorphism & Sticky) --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
                <FaHandHoldingHeart />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Bansos<span className="text-indigo-600">Kita</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Desa</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-slate-600 font-semibold hover:text-indigo-600 transition text-sm">
                Masuk
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/30 transition transform hover:-translate-y-0.5 text-sm">
                Daftar Penerima
              </Link>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600">
             Lebih Cepat & Adil
            </span>
          </h1>
          
          <p className="animate-fade-in-up delay-200 mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem informasi terpadu desa untuk menjamin bantuan sosial sampai kepada warga yang berhak dengan data yang valid dan terbuka.
          </p>
          
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1">
              Ajukan Sekarang <FaArrowRight className="text-sm" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition">
              Cek Status Saya
            </Link>
          </div>
        </div>

        {/* Background Blobs Animation */}
        <div className="absolute top-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* --- DATA PENERIMA (TRANSPARANSI) --- */}
      <section className="py-20 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <FaBullhorn className="text-indigo-600" /> Transparansi Publik
                </h2>
                <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
                    Berikut adalah daftar warga yang telah diverifikasi dan disetujui menerima bantuan pada periode terbaru.
                </p>
            </div>

            {/* TABEL CARD */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
                        <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-600" />
                        <p className="font-medium">Sedang memuat data terbaru...</p>
                    </div>
                ) : recipients.length === 0 ? (
                    <div className="p-20 text-center bg-slate-50 border-y border-slate-100">
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
                                    <th className="px-6 py-5 w-1/3">Alasan Persetujuan (SK Admin)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recipients.map((item, index) => (
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
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-2">
                                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-green-700 uppercase mb-1">Disetujui</p>
                                                    <p className="text-sm text-slate-600 italic leading-snug">
                                                        "{item.catatan_admin || 'Memenuhi kriteria administrasi dan validasi lapangan sesuai ketentuan.'}"
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
                    <p className="flex items-center gap-1"><FaInfoCircle /> Data diperbarui secara otomatis oleh sistem.</p>
                    <p>Menampilkan 10 data terbaru.</p>
                </div>
            </div>
        </div>
    </section>

      {/* --- HOW IT WORKS (Alur) --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Alur Penerimaan Bantuan</h2>
                <p className="text-slate-500 mt-4 text-lg">Tiga langkah mudah mendapatkan hak bantuan Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        <FaClipboardCheck />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">1. Registrasi Online</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Buat akun dan lengkapi formulir pengajuan. Upload foto KTP, KK, dan kondisi rumah melalui HP Anda.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        <FaSearchLocation />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">2. Validasi Surveyor</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Tim lapangan akan mengunjungi rumah Anda untuk memverifikasi data dan mengambil foto dokumentasi terbaru.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        <FaBoxOpen />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">3. Penyaluran Bantuan</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Jika disetujui, unduh Bukti Pengambilan Bantuan digital dan cairkan bantuan di Kantor Desa/Bank Penyalur.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                            <FaHandHoldingHeart />
                        </div>
                        <h2 className="text-2xl font-bold text-white">BansosKita</h2>
                    </div>
                    <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
                        Mewujudkan kesejahteraan sosial melalui penyaluran bantuan yang transparan, akuntabel, dan tepat sasaran bagi seluruh lapisan masyarakat.
                    </p>
                </div>
                
                <div>
                    <h3 className="font-bold text-white text-lg mb-6">Akses Cepat</h3>
                    <ul className="space-y-4">
                        <li><Link to="/login" className="hover:text-indigo-400 transition flex items-center gap-2"><FaArrowRight className="text-xs"/> Masuk Akun</Link></li>
                        <li><Link to="/register" className="hover:text-indigo-400 transition flex items-center gap-2"><FaArrowRight className="text-xs"/> Daftar Baru</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-white text-lg mb-6">Hubungi Kami</h3>
                    <ul className="space-y-4 text-slate-400">
                        <li>Jalan Merdeka No. 45, Desa Maju Jaya</li>
                        <li>(021) 123-4567</li>
                        <li>admin@bansoskita.id</li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                <p>&copy; 2025 BansosKita. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
                    <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;