import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUserById, updateUser, resetState } from "../../features/userSlice";
import { 
    FaArrowLeft, FaSave, FaUser, FaEnvelope, 
    FaLock, FaUserShield, FaInfoCircle, FaSpinner 
} from "react-icons/fa";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  
  // NEW: Local state for loading control
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // We only grab message and isError from Redux now
  const { isError, message } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(resetState()); 
    const loadUser = async () => {
        try {
            const result = await dispatch(getUserById(id)).unwrap();
            setName(result.name);
            setEmail(result.email);
            setRole(result.role);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };
    loadUser();
  }, [dispatch, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // START LOADING
    
    try {
        // Dispatch the action
        const action = await dispatch(updateUser({ 
            uuid: id, 
            name, 
            email, 
            password, 
            confPassword, 
            role 
        }));
        
        // Check if the action was fulfilled (successful)
        if (updateUser.fulfilled.match(action)) {
            navigate("/users");
        } else {
            // If rejected (failed), stop loading so user can try again
            setIsSubmitting(false);
        }
    } catch (error) {
        console.error("Update failed:", error);
        setIsSubmitting(false); // Stop loading on unexpected error
    }
  };

  return (
    <LayoutAdmin>
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Link 
                to="/users" 
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
            >
                <FaArrowLeft />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Edit Pengguna</h1>
                <p className="text-sm text-slate-500">Perbarui informasi dan hak akses pengguna.</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: INFO CARD */}
        <div className="lg:col-span-1">
             <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                <h3 className="text-lg font-bold mb-2">Informasi Akun</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                    Pastikan data yang Anda masukkan valid. Mengubah role akan mempengaruhi hak akses user tersebut di dalam sistem.
                </p>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {name && name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-sm">{name || "Nama User"}</p>
                        <p className="text-xs text-indigo-200">{role || "Role"}</p>
                    </div>
                </div>
             </div>
        </div>

        {/* KOLOM KANAN: FORM UPDATE */}
        <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                
                {isError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm flex items-center gap-2 animate-pulse">
                        <FaInfoCircle /> 
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    
                    {/* Nama & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-3.5 text-slate-400" />
                                <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-slate-800 text-sm font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan nama"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-3.5 text-slate-400" />
                                <input 
                                    type="email" 
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-slate-800 text-sm font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Role / Hak Akses</label>
                        <div className="relative">
                            <FaUserShield className="absolute left-4 top-3.5 text-slate-400" />
                            <select 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-slate-800 text-sm font-medium appearance-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">User (Warga)</option>
                                <option value="surveyor">Surveyor (Petugas Lapangan)</option>
                                <option value="admin">Admin (Administrator)</option>
                            </select>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-slate-100 pt-6 mt-2">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 flex gap-3 text-indigo-800 text-sm">
                            <FaInfoCircle className="text-lg mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-bold block">Ganti Password (Opsional)</span>
                                Kosongkan kolom di bawah jika Anda tidak ingin mengubah password user ini.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Password Baru</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-3.5 text-slate-400" />
                                    <input 
                                        type="password" 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-slate-800 text-sm font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-3.5 text-slate-400" />
                                    <input 
                                        type="password" 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-slate-800 text-sm font-medium"
                                        value={confPassword}
                                        onChange={(e) => setConfPassword(e.target.value)}
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting} // Use local state here
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {/* Use local state for spinner */}
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Simpan Perubahan
                        </button>
                        <Link 
                            to="/users"
                            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-sm transition"
                        >
                            Batal
                        </Link>
                    </div>

                </form>
            </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditUser;