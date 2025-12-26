import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMyBiodata, updateBiodata, resetBiodataState } from "../../features/biodataSlice";
import { 
    FaArrowLeft, FaSave, FaIdCard, FaMapMarkerAlt, 
    FaMoneyBillWave, FaInfoCircle, FaCamera, FaHandHoldingHeart 
} from "react-icons/fa";

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
        jenis_bantuan_dipilih: "" // Akan diisi otomatis
    });

    const [fileKTP, setFileKTP] = useState(null);
    const [fileKK, setFileKK] = useState(null);
    const [fileRumah, setFileRumah] = useState(null);
    const [previewKTP, setPreviewKTP] = useState("");

    // 1. Load Data User saat halaman dibuka
    useEffect(() => { 
        dispatch(getMyBiodata()); 
    }, [dispatch]);

    // 2. LOGIKA UTAMA: Mengisi Form (Dari Database ATAU dari Pilihan Dashboard)
    useEffect(() => {
        // Cek apakah user mengklik "Ajukan" dari Dashboard?
        const selectedProgram = localStorage.getItem("selectedProgram");

        if (biodata) {
            // JIKA SUDAH ADA DATA DI DATABASE (Mode Edit) -> Pakai data database
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
                // Prioritaskan data database, kalau kosong baru cek localStorage
                jenis_bantuan_dipilih: biodata.jenis_bantuan_dipilih || selectedProgram || "BLT Dana Desa"
            });
            
            // Set Preview Foto Lama
            if(biodata.foto_ktp) setPreviewKTP(`http://localhost:5000/uploads/${biodata.foto_ktp}`);
            
            // Bersihkan localStorage agar tidak mengganggu nanti
            localStorage.removeItem("selectedProgram");

        } else if (selectedProgram) {
            // JIKA BELUM ADA DATA (User Baru) tapi membawa pilihan dari Dashboard
            setFormData(prev => ({
                ...prev,
                jenis_bantuan_dipilih: selectedProgram
            }));
            localStorage.removeItem("selectedProgram");
        }
    }, [biodata]);

    // 3. Redirect setelah Sukses
    useEffect(() => {
        if(isSuccess){
            alert("Data pengajuan berhasil disimpan! Menunggu verifikasi admin.");
            dispatch(resetBiodataState());
            navigate("/dashboard");
        }
    }, [isSuccess, dispatch, navigate]);

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckbox = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    const handleFileChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            if(setPreview) setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        // Append text data
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        // Append files
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

                    {/* BAGIAN 0: PILIH JENIS BANTUAN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700 flex items-center gap-3 text-white">
                            <FaHandHoldingHeart className="text-xl" />
                            <h2 className="font-bold">Jenis Bantuan</h2>
                        </div>
                        <div className="p-6">
                            <label className="label-input mb-3">Program Bantuan Terpilih:</label>
                            
                            {/* Input Readonly agar User sadar apa yang dipilih */}
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
                    
                    {/* BAGIAN 1: IDENTITAS DIRI */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
                            <FaIdCard className="text-indigo-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Data Kependudukan</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2 bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mb-2">
                                <FaInfoCircle className="mt-0.5 text-lg" />
                                <div>
                                    <p className="font-bold">Akun Terdaftar:</p>
                                    <p>{user && user.name} ({user && user.email})</p>
                                </div>
                            </div>

                            <div>
                                <label className="label-input">NIK (Nomor Induk Kependudukan)</label>
                                <input type="text" name="nik" value={formData.nik} onChange={handleChange} className="input-field" placeholder="16 digit angka" required maxLength={16} />
                            </div>
                            <div>
                                <label className="label-input">Nomor Kartu Keluarga (KK)</label>
                                <input type="text" name="no_kk" value={formData.no_kk} onChange={handleChange} className="input-field" placeholder="16 digit angka" required maxLength={16} />
                            </div>
                            <div>
                                <label className="label-input">Tempat Lahir</label>
                                <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Tanggal Lahir</label>
                                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Jenis Kelamin</label>
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="input-field">
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-input">Agama</label>
                                <select name="agama" value={formData.agama} onChange={handleChange} className="input-field">
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

                    {/* BAGIAN 2: ALAMAT */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
                            <FaMapMarkerAlt className="text-orange-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Alamat Domisili</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="label-input">Alamat Lengkap (Jalan, RT/RW)</label>
                                <textarea name="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} className="input-field h-24" placeholder="Contoh: Jl. Merdeka No. 45, RT 01 RW 02" required></textarea>
                            </div>
                            <div>
                                <label className="label-input">Provinsi</label>
                                <input type="text" name="provinsi" value={formData.provinsi} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Kabupaten/Kota</label>
                                <input type="text" name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Kecamatan</label>
                                <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Desa/Kelurahan</label>
                                <input type="text" name="desa_kelurahan" value={formData.desa_kelurahan} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label-input">Kode Pos</label>
                                <input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label-input">Nomor Handphone/WA</label>
                                <input type="text" name="no_handphone" value={formData.no_handphone} onChange={handleChange} className="input-field" required />
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN 3: EKONOMI */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                            <FaMoneyBillWave className="text-green-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Kondisi Ekonomi</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-input">Pekerjaan Utama</label>
                                <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} className="input-field" placeholder="Contoh: Buruh Harian Lepas" required />
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

                    {/* BAGIAN 4: UPLOAD DOKUMEN */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-3">
                            <FaCamera className="text-purple-600 text-xl" />
                            <h2 className="font-bold text-slate-800">Upload Dokumen</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="label-input">Foto KTP</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition bg-slate-50">
                                    <input type="file" onChange={(e)=>handleFileChange(e, setFileKTP, setPreviewKTP)} className="text-sm text-slate-500 w-full" />
                                    {previewKTP && <img src={previewKTP} alt="Preview KTP" className="mt-3 h-32 w-full object-cover rounded-md border border-slate-300" />}
                                </div>
                            </div>
                            <div>
                                <label className="label-input">Foto Kartu Keluarga</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition bg-slate-50">
                                    <input type="file" onChange={(e)=>handleFileChange(e, setFileKK)} className="text-sm text-slate-500 w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="label-input">Foto Depan Rumah</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition bg-slate-50">
                                    <input type="file" onChange={(e)=>handleFileChange(e, setFileRumah)} className="text-sm text-slate-500 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN 5: BANTUAN LAIN */}
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
                        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Menyimpan...' : <><FaSave /> Simpan Data Pengajuan</>}
                        </button>
                    </div>

                </form>
            </div>
            
            <style>{`
                .label-input { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 0.25rem; }
                .input-field { width: 100%; padding: 0.625rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background-color: #f8fafc; transition: all 0.2s; }
                .input-field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2); background-color: #fff; }
            `}</style>
        </div>
    );
};

export default FormPengajuan;