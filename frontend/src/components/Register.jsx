import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser, reset } from "../features/authSlice";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaUserTag } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("user");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/"); 
      dispatch(reset()); 
    }
  }, [isSuccess, navigate, dispatch]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(RegisterUser({ name, email, password, confPassword, role }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
            
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">Create Account</h1>
            <p className="text-slate-500 mt-2">Join us and start your journey</p>
          </div>

          {isError && (
             <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
               {message}
             </div>
          )}

          <form onSubmit={Auth} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                   <FaUser />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                   <FaEnvelope />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <FaLock />
                        </div>
                        <input
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <FaCheckCircle />
                        </div>
                        <input
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        />
                    </div>
                </div>
            </div>

            {/* Role Selection (Styled) */}
            {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Register As</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FaUserTag />
                    </div>
                    <select 
                        value={role} 
                        onChange={(e)=>setRole(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-slate-700 cursor-pointer appearance-none"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin (Testing)</option>
                        <option value="survey">Surveyor (Testing)</option>
                    </select> */}
                    {/* Custom Arrow Icon */}
                    {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div> */}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 mt-6"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>Already have an account? <Link to="/" className="font-bold text-green-600 hover:text-green-800 transition">Log in</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;