import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getUserById, updateUser, resetState } from "../../features/userSlice";
import { FaArrowLeft, FaSave, FaExclamationCircle } from "react-icons/fa";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isLoading, message } = useSelector((state) => state.users);

  // Ambil data user saat halaman dimuat
  useEffect(() => {
    dispatch(resetState()); // Reset error lama
    const loadUser = async () => {
        try {
            // Panggil action getById, lalu isi form dengan data yang didapat
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
    
    // Kirim data update (termasuk id/uuid)
    const action = await dispatch(updateUser({ 
        uuid: id, 
        name, 
        email, 
        password, 
        confPassword, 
        role 
    }));
    
    if (updateUser.fulfilled.match(action)) {
        navigate("/users");
    }
  };

  return (
    <LayoutAdmin>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
            <Link to="/users" className="text-gray-500 hover:text-blue-600 transition">
                <FaArrowLeft />
            </Link>
            <h2 className="text-xl font-semibold text-slate-900">Edit User</h2>
        </div>
        <p className="text-sm text-gray-500 ml-7">Update user information and permissions.</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <div className="w-full max-w-2xl">
            
            {isError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    ⚠️ {message}
                </div>
            )}

            <div className="bg-white border border-gray-300 rounded-md shadow-sm">
                <div className="bg-[#f6f8fa] px-4 py-3 border-b border-gray-300 rounded-t-md flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700">Edit Profile</h3>
                    <span className="text-xs text-gray-500 font-mono">ID: {id}</span>
                </div>
                
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800 flex items-start gap-2">
                        <FaExclamationCircle className="mt-0.5" />
                        <span>Leave the password fields <b>blank</b> if you don't want to change the password.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={confPassword}
                                onChange={(e) => setConfPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role Permission</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="surveyor">Survey</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-[#2da44e] hover:bg-[#2c974b] text-white px-4 py-2 rounded-md font-medium text-sm border border-[rgba(27,31,36,0.15)] shadow-sm flex items-center gap-2"
                        >
                            {isLoading ? "Updating..." : <><FaSave /> Update User</>}
                        </button>
                        <Link 
                            to="/users"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm border border-gray-300 transition"
                        >
                            Cancel
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