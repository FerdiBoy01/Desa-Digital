import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser, userSelectors } from "../../features/userSlice"; 
import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(userSelectors.selectAll); // Asumsi pakai entityAdapter
  const { isLoading } = useSelector((state) => state.users); // Sesuaikan state name

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      dispatch(deleteUser(id));
    }
  };

  // Filter Search
  const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutAdmin>
        {/* HEADER PAGE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Data Pengguna</h1>
                <p className="text-slate-500 text-sm">Kelola akun admin, surveyor, dan warga.</p>
            </div>
            <Link to="/users/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition transform active:scale-95 text-sm">
                <FaPlus /> Tambah User Baru
            </Link>
        </div>

        {/* TOOLBAR (SEARCH) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="text-sm text-slate-500 font-medium">
                Total: {filteredUsers.length} User
            </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading data...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-slate-400">Tidak ada data ditemukan.</td></tr>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <tr key={user.uuid} className="hover:bg-slate-50 transition duration-150">
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'surveyor' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role === 'admin' && <FaUserShield />}
                                            {user.role === 'surveyor' && <FaUserTie />}
                                            {user.role === 'user' && <FaUser />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link 
                                                to={`/users/edit/${user.uuid}`} 
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                                                title="Edit"
                                            >
                                                <FaEdit className="text-xs" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(user.uuid)} 
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                title="Hapus"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                <span>Menampilkan {filteredUsers.length} data</span>
                {/* Pagination Placeholder (bisa dikembangkan nanti) */}
                <div className="flex gap-1">
                    <button className="px-2 py-1 rounded bg-white border border-slate-300 disabled:opacity-50" disabled>&lt;</button>
                    <button className="px-2 py-1 rounded bg-indigo-600 text-white border border-indigo-600">1</button>
                    <button className="px-2 py-1 rounded bg-white border border-slate-300 disabled:opacity-50" disabled>&gt;</button>
                </div>
            </div>
        </div>
    </LayoutAdmin>
  );
};

export default UserList;