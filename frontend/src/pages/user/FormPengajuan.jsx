import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMyBiodata, updateBiodata, resetBiodataState } from "../../features/biodataSlice";
import { 
    FaArrowLeft, FaSave, FaIdCard, FaMapMarkerAlt, 
    FaMoneyBillWave, FaInfoCircle, FaCamera, FaHandHoldingHeart,
    FaSpinner, FaCheckCircle, FaExclamationTriangle 
} from "react-icons/fa";
import Tesseract from 'tesseract.js';

const FormPengajuan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { biodata, isSuccess, isError, isLoading, message } = useSelector((state) => state.biodata);
    const { user } = useSelector((state) => state.auth);

    // --- STATE FORM ---
    const [formData, setFormData] = useState({
        nik: "", no_kk: "", tempat_lahir: "", tanggal_lahir: "", jenis_kelamin: "Laki-laki",
        agama: "Islam", pekerjaan: "", penghasilan_bulanan: "", jumlah_tanggungan: "",
        alamat_lengkap: "", provinsi: "", kabupaten: "", kecamatan: "", desa_kelurahan: "",
        kode_pos: "", no_handphone: "", penerima_pkh: false, penerima_bpnt: false,
        jenis_bantuan_dipilih: "" 
    });

    // --- STATE GEOLOCATION ---
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [lokasiStatus, setLokasiStatus] = useState("");

    // --- STATE FILE & OCR ---
    const [fileKTP, setFileKTP] = useState(null);
    const [fileKK, setFileKK] = useState(null);
    const [fileRumah, setFileRumah] = useState(null);
    const [previewKTP, setPreviewKTP] = useState("");
    
    // State untuk loading OCR
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrStatus, setOcrStatus] = useState(""); 

    useEffect(() => { 
        dispatch(getMyBiodata()); 
    }, [dispatch]);

    useEffect(() => {
        const selectedProgram = localStorage.getItem("selectedProgram");

        if (biodata) {
            setFormData({
                nik: biodata.nik || "", no_kk: biodata.no_kk || "",
                tempat_lahir: biodata.tempat_lahir || "", tanggal_lahir: biodata.tanggal_lahir || "",
                jenis_kelamin: biodata.jenis_kelamin || "Laki-laki", agama: biodata.agama || "Islam",
                pekerjaan: biodata.pekerjaan || "", penghasilan_bulanan: biodata.penghasilan_bulanan || "",
                jumlah_tanggungan: biodata.jumlah_tanggungan || "", alamat_lengkap: biodata.alamat_lengkap || "",
                provinsi: biodata.provinsi || "", kabupaten: biodata.kabupaten || "",
                kecamatan: biodata.kecamatan || "", desa_kelurahan: biodata.desa_kelurahan || "",
                kode_pos: biodata.kode_pos || "", no_handphone: biodata.no_handphone || "",
                penerima_pkh: biodata.penerima_pkh || false, penerima_bpnt: biodata.penerima_bpnt || false,
                jenis_bantuan_dipilih: biodata.jenis_bantuan_dipilih || selectedProgram || "BLT Dana Desa"
            });
            
            if (biodata.latitude && biodata.longitude) {
                setLatitude(biodata.latitude);
                setLongitude(biodata.longitude);
                setLokasiStatus("✅ Lokasi tersimpan.");
            }

            if(biodata.foto_ktp) setPreviewKTP(`http://localhost:5000/uploads/${biodata.foto_ktp}`);
            localStorage.removeItem("selectedProgram");

        } else if (selectedProgram) {
            setFormData(prev => ({
                ...prev,
                jenis_bantuan_dipilih: selectedProgram
            }));
            localStorage.removeItem("selectedProgram");
        }
    }, [biodata]);

    useEffect(() => {
        if(isSuccess){
            alert("Data pengajuan berhasil disimpan! Menunggu verifikasi admin.");
            dispatch(resetBiodataState());
            navigate("/dashboard");
        }
    }, [isSuccess, dispatch, navigate]);

    // --- FUNGSI AMBIL LOKASI (GEOLOCATION) ---
    const handleGetLocation = (e) => {
        e.preventDefault();
        setLokasiStatus("Sedang mengambil titik koordinat...");

        if (!navigator.geolocation) {
            setLokasiStatus("❌ Browser tidak mendukung GPS.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLokasiStatus("✅ Lokasi berhasil ditemukan!");
            },
            (error) => {
                console.error(error);
                setLokasiStatus("❌ Gagal. Pastikan GPS aktif dan Izinkan Akses Lokasi.");
            }
        );
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckbox = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    // --- FITUR BARU OCR: FUNGSI SCAN KTP V5 (HEADER & DESA FIX) ---
    const scanKTP = async (imageFile) => {
        setOcrLoading(true);
        setOcrStatus("Sedang membaca data KTP (Header & Isi)...");
        
        try {
            const result = await Tesseract.recognize(
                imageFile,
                'ind', 
                { logger: m => console.log(m) }
            );

            const text = result.data.text;
            console.log("=== HASIL OCR MENTAH ===");
            console.log(text);
            console.log("========================");

            let parsedData = {};
            let foundFields = [];

            // 1. CARI NIK (Tetap sama, ini paling penting)
            const cleanNumbers = text.replace(/[^0-9]/g, ""); 
            const nikMatch = cleanNumbers.match(/(\d{16})/);
            if (nikMatch) {
                parsedData.nik = nikMatch[0];
                foundFields.push("NIK");
            }

            // --- PARSING BARIS DEMI BARIS ---
            const lines = text.split('\n');
            
            // Variabel sementara untuk alamat
            let tempAlamat = "";
            let tempRTRW = "";

            lines.forEach((line, index) => {
                // Bersihkan baris: Huruf Besar, hapus simbol aneh
                const cleanLine = line.toUpperCase().replace(/[^A-Z0-9\s:,\/\-\.]/g, "").trim();

                // --- LOGIKA HEADER (PROVINSI & KABUPATEN) ---
                // Cek hanya di 3-4 baris pertama (Index 0-3)
                if (index < 4) {
                    // Cari PROVINSI
                    if (cleanLine.includes("PROVINSI")) {
                        parsedData.provinsi = cleanLine.replace("PROVINSI", "").trim();
                        foundFields.push("Provinsi");
                    }
                    // Cari KABUPATEN atau KOTA
                    if (cleanLine.includes("KABUPATEN")) {
                        parsedData.kabupaten = cleanLine.replace("KABUPATEN", "").trim();
                        foundFields.push("Kabupaten");
                    } else if (cleanLine.includes("KOTA") && !cleanLine.includes("KABUPATEN")) {
                        // Handle "KOTA JAKARTA SELATAN"
                        parsedData.kabupaten = cleanLine; 
                        foundFields.push("Kota");
                    } else if (cleanLine.includes("JAKARTA")) {
                        // Khusus KTP DKI yg formatnya kadang beda
                        if(!parsedData.kabupaten) parsedData.kabupaten = cleanLine;
                    }
                }

                // --- LOGIKA DESA/KELURAHAN (YANG DIPERBAIKI) ---
                // Regex: Mencari kata (KEL atau DESA atau KELURAHAN)
                if (/(KEL|DESA|KELURAHAN)/.test(cleanLine)) {
                    // Ambil teks setelah titik dua (:) atau spasi jika titik dua gak kebaca
                    if (cleanLine.includes(":")) {
                        let parts = cleanLine.split(":");
                        let desaRaw = parts[1].trim();
                        // Bersihkan kata 'DESA' atau 'KEL' yg mungkin kebawa lagi
                        desaRaw = desaRaw.replace("DESA", "").replace("KELURAHAN", "").trim();
                        parsedData.desa_kelurahan = desaRaw;
                        foundFields.push("Desa/Kel");
                    } else {
                        // Backup logic jika titik dua tidak terbaca
                        // Misal: "KelDesa SUKAMAJU"
                         let desaRaw = cleanLine.replace("KEL/DESA", "").replace("KELURAHAN", "").replace("DESA", "").trim();
                         if(desaRaw.length > 3) parsedData.desa_kelurahan = desaRaw;
                    }
                }

                // --- LOGIKA FIELD LAINNYA ---
                
                // KECAMATAN
                if (cleanLine.includes("KECAMATAN")) {
                    let kec = cleanLine.replace("KECAMATAN", "").replace(/:/g, "").trim();
                    parsedData.kecamatan = kec;
                    foundFields.push("Kecamatan");
                }

                // TEMPAT & TGL LAHIR
                if (cleanLine.includes("TEMPAT") || cleanLine.includes("LAHIR")) {
                     const dateRegex = /(\d{2})[-/\s](\d{2})[-/\s](\d{4})/;
                     const dateMatch = cleanLine.match(dateRegex);
                     
                     if (cleanLine.includes(":")) {
                        const content = cleanLine.split(":")[1].trim();
                        if (content.includes(",")) {
                            parsedData.tempat_lahir = content.split(",")[0].trim();
                            foundFields.push("Tempat Lahir");
                        }
                     }
                     if(dateMatch) {
                        parsedData.tanggal_lahir = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
                        foundFields.push("Tgl Lahir");
                     }
                }

                // ALAMAT (Simpan ke temp dulu)
                if (cleanLine.includes("ALAMAT")) {
                    tempAlamat = cleanLine.replace("ALAMAT", "").replace(/:/g, "").trim();
                }
                
                // RT/RW
                if (cleanLine.includes("RT/RW") || cleanLine.includes("RT")) {
                    tempRTRW = cleanLine.replace("RT/RW", "").replace("RT", "").replace("RW", "").replace(/:/g, "").trim();
                }

                // PEKERJAAN
                if (cleanLine.includes("PEKERJAAN")) {
                    const job = cleanLine.replace("PEKERJAAN", "").replace(/:/g, "").trim();
                    if(job.length > 3) {
                        parsedData.pekerjaan = job;
                        foundFields.push("Pekerjaan");
                    }
                }
                
                // AGAMA
                if (cleanLine.includes("AGAMA")) {
                    if (cleanLine.includes("ISLAM")) parsedData.agama = "Islam";
                    else if (cleanLine.includes("KRISTEN")) parsedData.agama = "Kristen";
                    else if (cleanLine.includes("KATOLIK")) parsedData.agama = "Katolik";
                    else if (cleanLine.includes("HINDU")) parsedData.agama = "Hindu";
                    else if (cleanLine.includes("BUDDHA")) parsedData.agama = "Buddha";
                    if(parsedData.agama) foundFields.push("Agama");
                }

                // GENDER
                if (cleanLine.includes("LAKI")) {
                    parsedData.jenis_kelamin = "Laki-laki";
                    foundFields.push("Gender");
                } else if (cleanLine.includes("PEREMPUAN")) {
                    parsedData.jenis_kelamin = "Perempuan";
                    foundFields.push("Gender");
                }
            });

            // GABUNGKAN ALAMAT LENGKAP
            // Kita gabungkan manual agar field "Alamat Lengkap" terisi penuh
            let fullAddress = tempAlamat;
            if (tempRTRW) fullAddress += `, RT/RW: ${tempRTRW}`;
            if (parsedData.desa_kelurahan) fullAddress += `, Kel. ${parsedData.desa_kelurahan}`;
            if (parsedData.kecamatan) fullAddress += `, Kec. ${parsedData.kecamatan}`;
            
            if (fullAddress.length > 5) {
                parsedData.alamat_lengkap = fullAddress;
                foundFields.push("Alamat Full");
            }

            // --- UPDATE STATE ---
            if (Object.keys(parsedData).length > 0) {
                setFormData(prev => ({
                    ...prev,
                    ...parsedData
                }));
                setOcrStatus(`✅ Berhasil Scan: ${foundFields.join(", ")}`);
            } else {
                setOcrStatus("⚠️ Gagal membaca data spesifik. Coba foto ulang dengan pencahayaan terang.");
            }

        } catch (error) {
            console.error("OCR Error:", error);
            setOcrStatus("❌ Error sistem OCR.");
        } finally {
            setOcrLoading(false);
        }
    };

    const handleFileChange = (e, setFile, setPreview, isKTP = false) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            if(setPreview) setPreview(URL.createObjectURL(file));

            if (isKTP) {
                scanKTP(file);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        
        data.append("latitude", latitude);
        data.append("longitude", longitude);

        if(fileKTP) data.append("foto_ktp", fileKTP);
        if(fileKK) data.append("foto_kk", fileKK);
        if(fileRumah) data.append("foto_rumah", fileRumah);

        dispatch(updateBiodata(data));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-100 transition"><FaArrowLeft /></Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Formulir Pengajuan</h1>
                        <p className="text-slate-500 text-sm">Lengkapi data untuk keperluan verifikasi bantuan.</p>
                    </div>
                </div>

                {isError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 border border-red-200">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* JENIS BANTUAN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700 flex items-center gap-3 text-white">
                            <FaHandHoldingHeart className="text-xl" />
                            <h2 className="font-bold">Jenis Bantuan</h2>
                        </div>
                        <div className="p-6">
                            <label className="label-input mb-3">Program Bantuan Terpilih:</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-bold mb-4 focus:outline-none"
                                value={formData.jenis_bantuan_dipilih}
                                readOnly
                            />
                            <p className="text-sm text-slate-500">
                                *Jenis bantuan otomatis terisi sesuai pilihan Anda di Dashboard. Jika ingin mengubah, silakan kembali ke Dashboard.
                            </p>
                        </div>
                    </div>

                     {/* --- BAGIAN UPLOAD DOKUMEN (LANGKAH 1) --- */}
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-l-4 border-l-purple-500">
                        <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-3">
                            <FaCamera className="text-purple-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Langkah 1: Upload Dokumen (Scan Otomatis)</h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 mb-6">
                                <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-bold mb-1">Fitur Smart Scan KTP 📸</p>
                                    <p>Upload foto KTP Anda yang jelas. Sistem akan mencoba <strong>mengisi data NIK, Alamat, dan Wilayah secara otomatis</strong>.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* --- INPUT KTP DENGAN INDIKATOR SCAN --- */}
                                <div className="relative">
                                    <label className="label-input mb-2 flex justify-between">
                                        Foto KTP 
                                        {ocrLoading && <span className="text-indigo-600 flex items-center gap-1 text-xs"><FaSpinner className="animate-spin"/> Memindai...</span>}
                                    </label>
                                    <div className={`border-2 border-dashed rounded-lg p-4 text-center transition relative overflow-hidden
                                        ${ocrLoading ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50 bg-slate-50'}
                                    `}>
                                        <input 
                                            type="file" 
                                            onChange={(e)=>handleFileChange(e, setFileKTP, setPreviewKTP, true)} 
                                            className="text-sm text-slate-500 w-full relative z-10" 
                                            accept="image/*"
                                            disabled={ocrLoading}
                                        />
                                        
                                        {previewKTP && (
                                            <div className="mt-3 relative">
                                                <img src={previewKTP} alt="Preview KTP" className="h-32 w-full object-cover rounded-md border border-slate-300" />
                                                {/* Overlay Scan Animation */}
                                                {ocrLoading && (
                                                    <div className="absolute inset-0 bg-indigo-900/20 z-20 animate-pulse rounded-md flex items-center justify-center">
                                                        <div className="h-1 w-full bg-indigo-400/80 absolute top-0 animate-scan-down shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Status Message OCR */}
                                    {ocrStatus && (
                                        <p className={`mt-2 text-xs flex items-center gap-1 font-medium
                                            ${ocrStatus.includes('✅') ? 'text-green-600' : ocrStatus.includes('⚠️') ? 'text-orange-600' : ocrStatus.includes('❌') ? 'text-red-600' : 'text-indigo-600'}
                                        `}>
                                            {ocrStatus.includes('✅') ? <FaCheckCircle/> : ocrStatus.includes('⚠️') ? <FaExclamationTriangle/> : null}
                                            {ocrStatus}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label-input mb-2">Foto Kartu Keluarga</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition bg-slate-50">
                                        <input type="file" onChange={(e)=>handleFileChange(e, setFileKK)} className="text-sm text-slate-500 w-full" accept="image/*" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label-input mb-2">Foto Depan Rumah</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition bg-slate-50">
                                        <input type="file" onChange={(e)=>handleFileChange(e, setFileRumah)} className="text-sm text-slate-500 w-full" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* DATA KEPENDUDUKAN (LANGKAH 2) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
                            <FaIdCard className="text-indigo-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Langkah 2: Lengkapi Data Kependudukan</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2 bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mb-2">
                                <FaInfoCircle className="mt-0.5 text-lg" />
                                <div>
                                    <p className="font-bold">Info:</p>
                                    <p>Periksa kembali data yang terisi otomatis. Anda tetap harus melengkapi data yang kosong secara manual.</p>
                                </div>
                            </div>

                            <div>
                                <label className="label-input flex justify-between">
                                    NIK (Nomor Induk Kependudukan)
                                    {formData.nik && ocrStatus.includes('NIK') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="nik" value={formData.nik} onChange={handleChange} className={`input-field ${formData.nik && ocrStatus.includes('NIK') ? 'bg-green-50 border-green-300' : ''}`} placeholder="16 digit angka" required maxLength={16} />
                            </div>
                            <div>
                                <label className="label-input">Nomor Kartu Keluarga (KK)</label>
                                <input type="text" name="no_kk" value={formData.no_kk} onChange={handleChange} className="input-field" placeholder="16 digit angka" required maxLength={16} />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Tempat Lahir
                                    {formData.tempat_lahir && ocrStatus.includes('Tempat') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} className={`input-field ${formData.tempat_lahir && ocrStatus.includes('Tempat') ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Tanggal Lahir
                                    {formData.tanggal_lahir && ocrStatus.includes('Tgl Lahir') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className={`input-field ${formData.tanggal_lahir && ocrStatus.includes('Tgl Lahir') ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Jenis Kelamin
                                    {formData.jenis_kelamin && ocrStatus.includes('Gender') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className={`input-field ${formData.jenis_kelamin && ocrStatus.includes('Gender') ? 'bg-green-50 border-green-300' : ''}`}>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Agama
                                    {formData.agama && ocrStatus.includes('Agama') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <select name="agama" value={formData.agama} onChange={handleChange} className={`input-field ${formData.agama && ocrStatus.includes('Agama') ? 'bg-green-50 border-green-300' : ''}`}>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ALAMAT & GEOLOCATION (LANGKAH 3) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
                            <FaMapMarkerAlt className="text-orange-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Langkah 3: Alamat Domisili</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="label-input flex justify-between">
                                    Alamat Lengkap (Jalan, RT/RW)
                                    {formData.alamat_lengkap && ocrStatus.includes('Alamat') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <textarea name="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} className={`input-field h-24 ${formData.alamat_lengkap && ocrStatus.includes('Alamat') ? 'bg-green-50 border-green-300' : ''}`} placeholder="Contoh: Jl. Merdeka No. 45, RT 01 RW 02" required></textarea>
                            </div>
                            
                            {/* --- FITUR GEOLOCATION --- */}
                            <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <label className="label-input flex items-center gap-2 text-yellow-800 mb-2">
                                    <FaMapMarkerAlt /> Titik Koordinat Rumah <span className="font-normal text-xs bg-yellow-200 px-2 py-0.5 rounded text-yellow-800">Wajib (Saat di Rumah)</span>
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <button 
                                        onClick={handleGetLocation}
                                        type="button" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition"
                                    >
                                        <FaMapMarkerAlt /> Ambil Lokasi Saya Sekarang
                                    </button>
                                    {lokasiStatus && (
                                        <span className={`text-sm font-medium animate-pulse ${lokasiStatus.includes('✅') ? 'text-green-600' : 'text-orange-600'}`}>
                                            {lokasiStatus}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-slate-500 font-mono flex gap-4">
                                    <span>Latitude: {latitude || "-"}</span>
                                    <span>Longitude: {longitude || "-"}</span>
                                </div>
                            </div>

                            <div>
                                <label className="label-input flex justify-between">
                                    Provinsi
                                    {formData.provinsi && ocrStatus.includes('Provinsi') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="provinsi" value={formData.provinsi} onChange={handleChange} className={`input-field ${formData.provinsi && ocrStatus.includes('Provinsi') ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Kabupaten/Kota
                                    {formData.kabupaten && (ocrStatus.includes('Kabupaten') || ocrStatus.includes('Kota')) && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="kabupaten" value={formData.kabupaten} onChange={handleChange} className={`input-field ${formData.kabupaten && (ocrStatus.includes('Kabupaten') || ocrStatus.includes('Kota')) ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Kecamatan
                                    {formData.kecamatan && ocrStatus.includes('Kecamatan') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} className={`input-field ${formData.kecamatan && ocrStatus.includes('Kecamatan') ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input flex justify-between">
                                    Desa/Kelurahan
                                    {formData.desa_kelurahan && ocrStatus.includes('Desa') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="desa_kelurahan" value={formData.desa_kelurahan} onChange={handleChange} className={`input-field ${formData.desa_kelurahan && ocrStatus.includes('Desa') ? 'bg-green-50 border-green-300' : ''}`} required />
                            </div>
                            <div>
                                <label className="label-input">Kode Pos</label>
                                <input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label-input">Nomor Handphone/WA (AKTIF)*</label>
                                <input type="text" name="no_handphone" value={formData.no_handphone} onChange={handleChange} className="input-field" required />
                            </div>
                        </div>
                    </div>

                    {/* EKONOMI (LANGKAH 4) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                            <FaMoneyBillWave className="text-green-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Langkah 4: Kondisi Ekonomi</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-input flex justify-between">
                                    Pekerjaan Utama
                                    {formData.pekerjaan && ocrStatus.includes('Pekerjaan') && <span className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle/> Terisi Otomatis</span>}
                                </label>
                                <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} className={`input-field ${formData.pekerjaan && ocrStatus.includes('Pekerjaan') ? 'bg-green-50 border-green-300' : ''}`} placeholder="Contoh: Buruh Harian Lepas" required />
                            </div>
                            <div>
                                <label className="label-input">Penghasilan Rata-rata per Bulan (Rp)</label>
                                <input type="number" name="penghasilan_bulanan" value={formData.penghasilan_bulanan} onChange={handleChange} className="input-field" placeholder="0" required />
                            </div>
                            <div>
                                <label className="label-input">Jumlah Tanggungan Keluarga</label>
                                <input type="number" name="jumlah_tanggungan" value={formData.jumlah_tanggungan} onChange={handleChange} className="input-field" placeholder="0" required />
                            </div>
                        </div>
                    </div>

                    {/* STATUS BANTUAN LAIN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">Status Bantuan Lain</h2>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition">
                                <input type="checkbox" name="penerima_pkh" checked={formData.penerima_pkh} onChange={handleCheckbox} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                <span className="text-slate-700 font-medium">Sedang Menerima PKH (Program Keluarga Harapan)</span>
                            </label>
                            
                            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition">
                                <input type="checkbox" name="penerima_bpnt" checked={formData.penerima_bpnt} onChange={handleCheckbox} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                <span className="text-slate-700 font-medium">Sedang Menerima BPNT (Bantuan Pangan Non-Tunai)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 pb-10">
                        <Link to="/dashboard" className="px-6 py-3 bg-white text-slate-700 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 transition">Batal</Link>
                        <button type="submit" disabled={isLoading || ocrLoading} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Menyimpan...' : <><FaSave /> Simpan Data Pengajuan</>}
                        </button>
                    </div>

                </form>
            </div>
            
            <style>{`
                .label-input { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 0.25rem; }
                .input-field { width: 100%; padding: 0.625rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background-color: #f8fafc; transition: all 0.2s; }
                .input-field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2); background-color: #fff; }
                
                @keyframes scan-down {
                    0% { top: 0; opacity: 0.8; }
                    50% { top: 100%; opacity: 0.8; }
                    51% { top: 0; opacity: 0; }
                    100% { top: 0; opacity: 0.8; }
                }
                .animate-scan-down {
                    animation: scan-down 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default FormPengajuan;