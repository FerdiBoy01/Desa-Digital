import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser, userSelectors } from "../../features/userSlice";
import { Link } from "react-router-dom";
import { 
    FaTrash, FaEdit, FaPlus, FaUserShield, FaUserTie, FaUser, FaSearch,
    FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

const Users = () => {
  const dispatch = useDispatch();
  
  // Ambil data logic
  const users = useSelector(userSelectors.selectAll);
  const { isLoading, isError, message } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  // --- STATE PAGINATION & SEARCH ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (uuid) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
        dispatch(deleteUser(uuid));
    }
  };

  // --- LOGIKA FILTER SEARCH ---
  const filteredUsers = users.filter((user) => {
      if (searchTerm === "") return user;
      const lowerSearch = searchTerm.toLowerCase();
      return (
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
  });

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset halaman ke 1 saat user melakukan pencarian
  const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
  };

  // Ganti Halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <LayoutAdmin>
      {/* --- HEADER PAGE --- */}
      <div className="mb-5 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold text-slate-900">Users Management</h2>
            <p className="text-sm text-slate-500 mt-1">Manage access and roles for the platform.</p>
        </div>
        
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
      <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        
        {/* Search Bar */}
        <div className="bg-[#f6f8fa] p-3 border-b border-gray-300 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaSearch className="text-xs" />
                </span>
                <input 
                    type="text" 
                    placeholder="Find a user by name or email..." 
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="text-xs text-gray-500 font-medium hidden md:block">
                Total: {filteredUsers.length} users
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
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
                    ) : currentItems.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500">No users found matching your search.</td></tr>
                    ) : (
                        currentItems.map((user, index) => (
                            <tr key={user.uuid} className="hover:bg-gray-50 transition-colors">
                                {/* Nomor urut disesuaikan dengan halaman */}
                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                                    {indexOfFirstItem + index + 1}
                                </td>
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
                                        {/* Edit Button */}
                                        <Link 
                                            to={`/users/edit/${user.uuid}`} 
                                            className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-400 transition text-xs flex items-center gap-1"
                                            title="Edit"
                                        >
                                            <FaEdit /> <span className="hidden md:inline">Edit</span>
                                        </Link>
                                        
                                        {/* Delete Button */}
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
        </div>

        {/* --- PAGINATION CONTROLS (Footer) --- */}
        {!isLoading && filteredUsers.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                
                {/* Info Text (Mobile & Desktop) */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                        </p>
                    </div>
                    
                    {/* Tombol Navigasi Desktop */}
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <FaChevronLeft className="h-4 w-4" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-xs font-medium 
                                        ${currentPage === i + 1 
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <FaChevronRight className="h-4 w-4" />
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Mobile Pagination (Simplified) */}
                <div className="flex items-center justify-between sm:hidden w-full">
                     <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

// --- BADGE COMPONENT (GitHub Label Style) ---
const RoleBadge = ({ role }) => {
    let classes = "bg-gray-100 text-gray-600 border-gray-200";
    let Icon = FaUser;

    if (role === "admin") {
        classes = "bg-purple-50 text-purple-700 border-purple-200";
        Icon = FaUserShield;
    } else if (role === "surveyor" || role === "survey") {
        classes = "bg-green-50 text-green-700 border-green-200";
        Icon = FaUserTie;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            <Icon className="text-[10px]" /> <span className="capitalize">{role}</span>
        </span>
    );
};

export default Users;