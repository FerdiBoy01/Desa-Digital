import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyBiodata } from "../../features/biodataSlice";
import QRCode from "react-qr-code";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

const SuratPersetujuan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { biodata, isLoading } = useSelector((state) => state.biodata);

    useEffect(() => {
        dispatch(getMyBiodata());
    }, [dispatch]);

    // Proteksi: Jika belum disetujui, tendang balik ke dashboard
    useEffect(() => {
        if (biodata && biodata.status_pengajuan !== "Disetujui") {
            alert("Dokumen ini hanya tersedia untuk pengajuan yang DISETUJUI.");
            navigate("/dashboard");
        }
    }, [biodata, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading || !biodata) return <div className="text-center mt-20">Memuat Dokumen...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-serif">
            {/* TOMBOL AKSI (Akan hilang saat diprint) */}
            <div className="max-w-[21cm] mx-auto mb-4 flex justify-between items-center print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <FaArrowLeft /> Kembali
                </button>
                <button 
                    onClick={handlePrint} 
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-blue-700"
                >
                    <FaPrint /> Cetak / Simpan PDF
                </button>
            </div>

            {/* KERTAS A4 */}
            <div className="bg-white max-w-[21cm] mx-auto p-[2cm] shadow-lg print:shadow-none print:p-0 print:m-0">
                
                {/* 1. KOP SURAT */}
                <div className="border-b-4 border-double border-black pb-4 mb-6 text-center">
                    <h3 className="text-lg font-bold uppercase tracking-wide">Pemerintah Kabupaten {biodata.kabupaten || "............."}</h3>
                    <h2 className="text-xl font-bold uppercase">Kecamatan {biodata.kecamatan || "............."}</h2>
                    <h1 className="text-2xl font-extrabold uppercase">Desa {biodata.desa_kelurahan || "............."}</h1>
                    <p className="text-sm italic mt-1">Alamat: Kantor Kepala Desa {biodata.desa_kelurahan}, Kode Pos {biodata.kode_pos}</p>
                </div>

                {/* 2. JUDUL SURAT */}
                <div className="text-center mb-8">
                    <h2 className="text-lg font-bold underline">SURAT BUKTI PENERIMA BANTUAN SOSIAL</h2>
                    <p className="text-sm">Nomor: BANSOS/{new Date().getFullYear()}/{biodata.uuid.substring(0, 6).toUpperCase()}</p>
                </div>

                {/* 3. ISI SURAT */}
                <div className="text-justify leading-relaxed text-base space-y-4">
                    <p>
                        Berdasarkan hasil verifikasi data administrasi dan validasi lapangan yang telah dilakukan oleh Tim Penyaluran Bantuan Sosial Desa <strong>{biodata.desa_kelurahan}</strong>, dengan ini menerangkan bahwa:
                    </p>

                    <table className="w-full ml-4">
                        <tbody>
                            <tr>
                                <td className="w-40 py-1 font-bold">Nama Lengkap</td>
                                <td>: {biodata.user?.name}</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-bold">NIK</td>
                                <td>: {biodata.nik}</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-bold">No. Kartu Keluarga</td>
                                <td>: {biodata.no_kk}</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-bold">Alamat</td>
                                <td>: {biodata.alamat_lengkap}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        Dinyatakan <strong>BERHAK</strong> dan <strong>DISETUJUI</strong> sebagai penerima manfaat Program Bantuan:
                    </p>

                    <div className="border-2 border-black p-4 text-center my-4 bg-gray-50 print:bg-white">
                        <h3 className="text-xl font-bold uppercase">{biodata.jenis_bantuan_dipilih}</h3>
                        <p className="text-sm">Periode Penyaluran: {new Date().getFullYear()}</p>
                    </div>

                    <p>
                        Surat ini berlaku sebagai bukti sah untuk pengambilan bantuan di <strong>Kantor Desa / Bank Penyalur</strong> dengan membawa dokumen asli (KTP & KK).
                    </p>
                </div>

                {/* 4. TANDA TANGAN & QR */}
                <div className="flex justify-between items-end mt-16">
                    <div className="text-center">
                        <div className="border p-2 inline-block bg-white">
                            {/* QR CODE untuk Validasi Keaslian */}
                            <QRCode 
                                value={`VALID-BANSOS-${biodata.nik}-${biodata.status_pengajuan}`} 
                                size={100} 
                            />
                        </div>
                        <p className="text-xs mt-1 text-gray-500">Scan untuk validasi</p>
                    </div>

                    <div className="text-center w-60">
                        <p className="mb-20">
                            {biodata.desa_kelurahan}, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})} <br/>
                            Kepala Desa,
                        </p>
                        <p className="font-bold border-b border-black inline-block min-w-[150px]">( ..................................... )</p>
                        <p>NIP. .....................................</p>
                    </div>
                </div>
                
                <div className="mt-10 text-xs text-slate-400 italic text-center print:text-black">
                    *Dokumen ini dicetak secara otomatis oleh sistem Aplikasi BansosKita.
                </div>

            </div>
        </div>
    );
};

export default SuratPersetujuan;