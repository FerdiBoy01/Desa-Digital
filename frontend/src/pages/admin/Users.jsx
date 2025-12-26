import React, { useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser, userSelectors } from "../../features/userSlice";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus, FaUserShield, FaUserTie, FaUser, FaSearch } from "react-icons/fa";

const Users = () => {
  const dispatch = useDispatch();
  
  // Ambil data logic (TETAP SAMA)
  const users = useSelector(userSelectors.selectAll);
  const { isLoading, isError, message } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (uuid) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
        dispatch(deleteUser(uuid));
    }
  };

  return (
    <LayoutAdmin>
      {/* --- HEADER PAGE --- */}
      <div className="mb-5 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold text-slate-900">Users Management</h2>
            <p className="text-sm text-slate-500 mt-1">Manage access and roles for the platform.</p>
        </div>
        
        {/* Tombol Hijau Khas GitHub */}
        <Link 
            to="/users/add" 
            className="bg-[#2da44e] hover:bg-[#2c974b] text-white text-sm font-medium px-4 py-2 rounded-md border border-[rgba(27,31,36,0.15)] shadow-sm transition flex items-center gap-2"
        >
            <FaPlus className="text-xs" /> New User
        </Link>
      </div>

      {isError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {message}
        </div>
      )}

      {/* --- TABLE CONTAINER (GitHub Style Box) --- */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
        
        {/* Fake Search Bar (Hiasan agar mirip GitHub Repo List) */}
        <div className="bg-[#f6f8fa] p-3 border-b border-gray-300 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaSearch className="text-xs" />
                </span>
                <input 
                    type="text" 
                    placeholder="Find a user..." 
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div className="text-xs text-gray-500 font-medium hidden md:block">
                {users.length} users total
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 w-10">#</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading data...</td></tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={user.uuid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{user.email}</td>
                                <td className="px-4 py-3">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Edit Button (Gray Style) */}
                                        <Link 
                                            to={`/users/edit/${user.uuid}`} 
                                            className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400 transition text-xs flex items-center gap-1"
                                            title="Edit"
                                        >
                                            <FaEdit /> <span className="hidden md:inline">Edit</span>
                                        </Link>
                                        
                                        {/* Delete Button (Danger Style) */}
                                        <button 
                                            onClick={() => handleDelete(user.uuid)}
                                            className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-md text-gray-600 hover:text-red-600 hover:border-red-400 transition text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={currentUser && currentUser.uuid === user.uuid}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {!isLoading && users.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">No users found.</p>
                    <Link to="/users/add" className="text-blue-600 hover:underline text-sm">Create user now</Link>
                </div>
            )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

// --- BADGE COMPONENT (GitHub Label Style) ---
const RoleBadge = ({ role }) => {
    let classes = "bg-gray-100 text-gray-600 border-gray-200";
    let Icon = FaUser;

    if (role === "admin") {
        classes = "bg-purple-50 text-purple-700 border-purple-200"; // Ungu khas label
        Icon = FaUserShield;
    } else if (role === "survey") {
        classes = "bg-green-50 text-green-700 border-green-200"; // Hijau khas label
        Icon = FaUserTie;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            <Icon className="text-[10px]" /> <span className="capitalize">{role}</span>
        </span>
    );
};

export default Users;