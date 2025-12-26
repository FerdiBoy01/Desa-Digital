import React, { useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { submitSurveyData } from "../../features/biodataSlice"; // Pastikan import ini benar
import { FaCamera, FaSave, FaArrowLeft } from "react-icons/fa";

const InputSurvey = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [catatan, setCatatan] = useState("");
    const [fotoLokasi, setFotoLokasi] = useState(null);
    const [fotoKondisi, setFotoKondisi] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append("catatan_surveyor", catatan);
            if(fotoLokasi) data.append("foto_survey_lokasi", fotoLokasi);
            if(fotoKondisi) data.append("foto_survey_kondisi_rumah", fotoKondisi);

            // Kirim data
            await dispatch(submitSurveyData({ uuid: id, data })).unwrap();
            
            alert("Laporan survey berhasil dikirim!");
            navigate("/surveyor/dashboard");
        } catch (error) {
            alert("Gagal mengirim data: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LayoutAdmin>
            <button onClick={()=>navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition font-medium">
                <FaArrowLeft /> Kembali
            </button>

            <h2 className="text-2xl font-bold mb-2 text-slate-800">Input Laporan Survey</h2>
            <p className="text-slate-500 mb-6">Unggah bukti foto dan catatan kondisi lapangan.</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
                
                <div className="mb-6">
                    <label className="block font-bold mb-2 text-slate-700">Catatan Temuan Lapangan</label>
                    <textarea 
                        className="w-full border border-slate-300 p-3 rounded-lg h-32 focus:outline-none focus:border-indigo-500" 
                        placeholder="Deskripsikan kondisi rumah, aset yang terlihat (mobil/motor), dan kesesuaian dengan data pengajuan..."
                        value={catatan}
                        onChange={(e)=>setCatatan(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Input Foto 1 */}
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${fotoLokasi ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                        <FaCamera className={`mx-auto text-3xl mb-3 ${fotoLokasi ? 'text-green-500' : 'text-slate-300'}`} />
                        <label className="block font-bold mb-2 text-sm text-slate-700">Foto Warga di Lokasi</label>
                        <input type="file" onChange={(e)=>setFotoLokasi(e.target.files[0])} required className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>

                    {/* Input Foto 2 */}
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${fotoKondisi ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                        <FaCamera className={`mx-auto text-3xl mb-3 ${fotoKondisi ? 'text-green-500' : 'text-slate-300'}`} />
                        <label className="block font-bold mb-2 text-sm text-slate-700">Foto Kondisi Rumah</label>
                        <input type="file" onChange={(e)=>setFotoKondisi(e.target.files[0])} required className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-70">
                    {isLoading ? "Mengirim..." : <><FaSave /> Kirim Laporan Survey</>}
                </button>
            </form>
        </LayoutAdmin>
    );
};
export default InputSurvey;