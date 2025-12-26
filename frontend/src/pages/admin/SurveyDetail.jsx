import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getBiodataById, verifyUserBiodata } from "../../features/biodataSlice";
import { 
    FaArrowLeft, FaIdCard, FaMapMarkerAlt, FaMoneyBillWave, 
    FaCamera, FaCheck, FaTimes, FaHandHoldingHeart, FaUserCheck, FaLightbulb, FaRobot 
} from "react-icons/fa";

const SurveyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { biodata, isLoading, isError, message } = useSelector((state) => state.biodata);

  // State untuk menyimpan hasil analisa sistem
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    dispatch(getBiodataById(id));
  }, [dispatch, id]);

  // --- LOGIKA ALGORITMA REKOMENDASI ---
  useEffect(() => {
    if (biodata) {
        analyzeData(biodata);
    }
  }, [biodata]);

  const analyzeData = (data) => {
      let score = 0;
      let reasons = [];
      let isRecommended = false;

      // 1. Analisa Ekonomi (User Input)
      if (data.penghasilan_bulanan <= 1000000) {
          score += 40;
          reasons.push("✅ Penghasilan sangat rendah (Di bawah 1 Juta).");
      } else if (data.penghasilan_bulanan <= 2000000) {
          score += 20;
          reasons.push("✅ Penghasilan rendah (1 - 2 Juta).");
      } else {
          score -= 20;
          reasons.push("⚠️ Penghasilan tergolong cukup (> 2 Juta).");
      }

      // 2. Analisa Tanggungan
      if (data.jumlah_tanggungan >= 3) {
          score += 20;
          reasons.push("✅ Jumlah tanggungan banyak (3+ orang).");
      }

      // 3. Analisa Cross-Check dengan Surveyor (PENTING)
      // Kita cari kata kunci negatif di catatan surveyor
      const note = data.catatan_surveyor ? data.catatan_surveyor.toLowerCase() : "";
      
      if (note.includes("mewah") || note.includes("bagus") || note.includes("mampu") || note.includes("kaya") || note.includes("mobil")) {
          score -= 100; // Pengurangan drastis jika surveyor bilang mampu
          reasons.push("⛔ ALERT: Surveyor mencatat indikasi 'Mampu/Mewah' (Tidak Sesuai Kriteria).");
      } else if (note.includes("rusak") || note.includes("kumuh") || note.includes("layak") || note.includes("prihatin")) {
          score += 40;
          reasons.push("✅ Validasi Surveyor: Kondisi rumah mendukung untuk dibantu.");
      }

      // 4. Cek Kelengkapan Data Survey
      if (!data.is_surveyed) {
          reasons.push("❌ Belum disurvey (Data tidak bisa dianalisa validitasnya).");
          score = -999; 
      }

      // KEPUTUSAN SISTEM
      if (score >= 50) isRecommended = true;

      setRecommendation({
          decision: isRecommended ? "DISARANKAN: SETUJUI" : "DISARANKAN: TOLAK / TINJAU ULANG",
          score: score,
          details: reasons,
          color: isRecommended ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
      });
  };

  const handleVerification = async (status) => {
    let catatan = "";
    
    if(status === "Ditolak") {
        catatan = prompt("Masukkan alasan penolakan (Wajib diisi):");
        if(!catatan) return; 
    } else {
        const confirmApprove = window.confirm("Apakah Anda yakin menyetujui pengajuan ini?");
        if(!confirmApprove) return;
        catatan = "Data valid dan telah diverifikasi.";
    }

    await dispatch(verifyUserBiodata({ uuid: id, status, catatan }));
    dispatch(getBiodataById(id));
    alert(`Status berhasil diubah menjadi: ${status}`);
  };

  if (isLoading && !biodata) return <LayoutAdmin><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div></LayoutAdmin>;
  if (isError) return <LayoutAdmin><div className="text-red-500 text-center py-20 font-bold">{message}</div></LayoutAdmin>;
  if (!biodata) return <LayoutAdmin><div className="text-center py-20 text-slate-500">Data tidak ditemukan.</div></LayoutAdmin>;

  return (
    <LayoutAdmin>
      {/* HEADER PAGE */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
            <Link to="/surveys" className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 text-gray-600 transition shadow-sm">
                <FaArrowLeft />
            </Link>
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-800">Detail Pengajuan</h2>
                    <span className={`px-2 py-0.5 text-xs rounded font-bold uppercase border ${
                        biodata.status_pengajuan === 'Disetujui' ? 'bg-green-100 text-green-700 border-green-200' :
                        biodata.status_pengajuan === 'Ditolak' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                        {biodata.status_pengajuan || 'Menunggu'}
                    </span>
                </div>
                <p className="text-sm text-slate-500">
                    Pemohon: <span className="font-semibold text-indigo-600">{biodata.user?.name}</span> • {biodata.user?.email}
                </p>
            </div>
        </div>
        
        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 text-sm font-bold flex items-center gap-2">
            <FaHandHoldingHeart />
            Program: {biodata.jenis_bantuan_dipilih || "Tidak Dipilih"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* KOLOM KIRI: DATA TEKS */}
        <div className="lg:col-span-2 space-y-6">
            
            <CardSection title="Data Kependudukan" icon={<FaIdCard className="text-indigo-600" />}>
                <InfoRow label="NIK" value={biodata.nik} />
                <InfoRow label="No. KK" value={biodata.no_kk} />
                <InfoRow label="Tempat, Tgl Lahir" value={`${biodata.tempat_lahir}, ${biodata.tanggal_lahir}`} />
                <InfoRow label="Jenis Kelamin" value={biodata.jenis_kelamin} />
                <InfoRow label="Agama" value={biodata.agama} />
            </CardSection>

            <CardSection title="Ekonomi & Bantuan" icon={<FaMoneyBillWave className="text-green-600" />}>
                <InfoRow label="Pekerjaan" value={biodata.pekerjaan} />
                <InfoRow label="Penghasilan Bulanan" value={`Rp ${biodata.penghasilan_bulanan?.toLocaleString('id-ID')}`} />
                <InfoRow label="Jml. Tanggungan" value={`${biodata.jumlah_tanggungan} Orang`} />
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bantuan Lain yang Diterima</p>
                    <div className="flex gap-2">
                        <Badge label="PKH" active={biodata.penerima_pkh} />
                        <Badge label="BPNT" active={biodata.penerima_bpnt} />
                    </div>
                </div>
            </CardSection>

            <CardSection title="Domisili" icon={<FaMapMarkerAlt className="text-orange-600" />}>
                <p className="text-slate-800 font-medium mb-1">{biodata.alamat_lengkap}</p>
                <p className="text-sm text-slate-500">
                    Desa {biodata.desa_kelurahan}, Kec. {biodata.kecamatan}<br/>
                    {biodata.kabupaten} - {biodata.provinsi} <span className="font-mono text-xs bg-slate-100 px-1">({biodata.kode_pos})</span>
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Kontak</span>
                    <p className="font-medium text-slate-800">{biodata.no_handphone}</p>
                </div>
            </CardSection>

            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 flex items-center gap-3">
                    <div className="text-lg bg-white p-1.5 rounded-full shadow-sm text-teal-600"><FaUserCheck /></div>
                    <h3 className="font-bold text-slate-800">Hasil Validasi Lapangan (Surveyor)</h3>
                </div>
                
                <div className="p-6">
                    {!biodata.is_surveyed ? (
                       <div className="bg-orange-50 border-l-4 border-orange-400 p-4 text-orange-800">
                           <p className="font-bold">⚠️ Belum Disurvey</p>
                           <p className="text-sm mt-1">
                               Tim Surveyor belum mengunjungi lokasi atau belum mengupload data.
                           </p>
                       </div>
                    ) : (
                       <div>
                           <div className="flex justify-between items-start mb-4 bg-teal-50/50 p-3 rounded border border-teal-100">
                               <div>
                                   <p className="text-xs text-slate-500 uppercase font-bold">Petugas Surveyor</p>
                                   <p className="font-bold text-slate-800">{biodata.nama_surveyor}</p>
                               </div>
                               <div className="text-right">
                                   <p className="text-xs text-slate-500 uppercase font-bold">Tanggal Survey</p>
                                   <p className="font-mono text-sm">{biodata.tgl_survey}</p>
                               </div>
                           </div>
                           <p className="font-bold text-sm text-slate-500 mb-2">Catatan Lapangan:</p>
                           <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 text-sm whitespace-pre-line mb-4">
                               {biodata.catatan_surveyor}
                           </p>
                           <div className="grid grid-cols-2 gap-4">
                                <PhotoBox label="Foto Lokasi & Warga" filename={biodata.foto_survey_lokasi} />
                                <PhotoBox label="Kondisi Rumah" filename={biodata.foto_survey_kondisi_rumah} />
                           </div>
                       </div>
                    )}
                </div>
            </div>

        </div>

        {/* KOLOM KANAN: PANEL REKOMENDASI & AKSI (STICKY) */}
        <div className="space-y-6 sticky top-24 h-fit z-10">
            
            {/* --- FITUR BARU: PANEL REKOMENDASI SISTEM --- */}
            {recommendation && biodata.is_surveyed && biodata.status_pengajuan === 'Menunggu' && (
                <div className={`rounded-lg border-2 p-4 shadow-sm ${recommendation.color}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                        <FaRobot className="text-xl" />
                        {recommendation.decision}
                    </div>
                    <div className="mb-3">
                        <div className="w-full bg-white rounded-full h-2.5 mb-1 border border-gray-300">
                            <div className={`h-2.5 rounded-full ${recommendation.score >= 50 ? 'bg-green-600' : 'bg-red-600'}`} style={{width: `${Math.min(Math.max(recommendation.score, 0), 100)}%`}}></div>
                        </div>
                        <p className="text-xs font-mono">Skor Kelayakan: {recommendation.score}/100</p>
                    </div>
                    
                    <p className="text-xs font-bold uppercase mb-1 opacity-70">Dasar Pertimbangan:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                        {recommendation.details.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* BOX VERIFIKASI */}
            <div className="bg-white border border-blue-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 font-bold text-blue-800 flex items-center gap-2">
                    <FaLightbulb /> Keputusan Admin
                </div>
                <div className="p-4">
                    <p className="text-xs text-slate-500 mb-4">
                        Periksa kelengkapan data user dan hasil survey sebelum memberikan keputusan.
                    </p>
                    
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => handleVerification('Disetujui')}
                            disabled={!biodata.is_surveyed || biodata.status_pengajuan === 'Disetujui'}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCheck /> Setujui Pengajuan
                        </button>
                        <button 
                            onClick={() => handleVerification('Ditolak')}
                            disabled={biodata.status_pengajuan === 'Ditolak'}
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded font-medium shadow-sm transition disabled:opacity-50"
                        >
                            <FaTimes /> Tolak Pengajuan
                        </button>
                    </div>

                    {biodata.catatan_admin && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 italic">
                            "Catatan Admin: {biodata.catatan_admin}"
                        </div>
                    )}
                </div>
            </div>

            {/* BOX DOKUMEN */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 font-bold text-slate-700">
                    <FaCamera /> Dokumen Dari Pemohon
                </div>
                <div className="p-4 space-y-4">
                    <PhotoBox label="KTP" filename={biodata.foto_ktp} />
                    <PhotoBox label="Kartu Keluarga" filename={biodata.foto_kk} />
                </div>
            </div>

        </div>

      </div>
    </LayoutAdmin>
  );
};

// --- SUB COMPONENTS ---
const CardSection = ({ title, icon, children }) => (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-slate-50">
            <div className="text-lg bg-white p-1.5 rounded-full shadow-sm">{icon}</div>
            <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6 space-y-1">{children}</div>
    </div>
);
const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-slate-50 px-2 rounded transition">
        <span className="text-sm text-gray-500 min-w-[140px]">{label}</span>
        <span className="text-sm font-medium text-slate-800 text-right">{value || "-"}</span>
    </div>
);
const Badge = ({ label, active }) => (
    <span className={`px-2 py-1 text-xs font-bold rounded border flex items-center gap-1 ${active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
        {active ? <FaCheck className="text-[10px]" /> : <FaTimes className="text-[10px]" />}
        {label}
    </span>
);
const PhotoBox = ({ label, filename }) => (
    <div>
        <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
        {filename ? (
            <a href={`http://localhost:5000/uploads/${filename}`} target="_blank" rel="noreferrer">
                <img src={`http://localhost:5000/uploads/${filename}`} alt={label} className="w-full h-40 object-cover rounded border border-gray-300 hover:opacity-80 transition cursor-zoom-in bg-gray-100" onError={(e) => {e.target.src="https://via.placeholder.com/400x200?text=Gambar+Rusak"}} />
            </a>
        ) : (
            <div className="w-full h-40 bg-gray-100 rounded border border-gray-300 border-dashed flex items-center justify-center text-gray-400 text-xs flex-col gap-2"><FaCamera className="text-2xl opacity-20" />Tidak ada foto</div>
        )}
    </div>
);

export default SurveyDetail;