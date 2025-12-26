import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createUser, resetState } from "../../features/userSlice";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("user");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isLoading, message } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
        const action = await dispatch(createUser({ name, email, password, confPassword, role }));
            if (createUser.fulfilled.match(action)) {
                navigate("/users");
    }
  };

  return (
    <LayoutAdmin>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
            <Link to="/users" className="text-gray-500 hover:text-blue-600 transition">
                <FaArrowLeft />
            </Link>
            <h2 className="text-xl font-semibold text-slate-900">Create New User</h2>
        </div>
        <p className="text-sm text-gray-500 ml-7">Add a new account to the system.</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <div className="w-full max-w-2xl">
            
            {/* Alert Error */}
            {isError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    ⚠️ {message}
                </div>
            )}

            {/* Form Card (GitHub Style) */}
            <div className="bg-white border border-gray-300 rounded-md shadow-sm">
                <div className="bg-[#f6f8fa] px-4 py-3 border-b border-gray-300 rounded-t-md">
                    <h3 className="text-sm font-bold text-slate-700">Account Information</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                            placeholder="e.g. john@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                                value={confPassword}
                                onChange={(e) => setConfPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role Permission</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User (Standard Access)</option>
                            <option value="admin">Admin (Full Access)</option>
                            <option value="survey">Surveyor (Field Access)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Select the access level for this user.</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-[#2da44e] hover:bg-[#2c974b] text-white px-4 py-2 rounded-md font-medium text-sm border border-[rgba(27,31,36,0.15)] shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : <><FaSave /> Create User</>}
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

export default AddUser;