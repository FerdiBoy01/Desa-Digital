import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      // --- LOGIKA REDIRECT ---
      if (user && user.role === "surveyor") {
        navigate("/surveyor/dashboard"); 
      } else if (user && user.role === "admin") {
         navigate("/dashboard"); 
      } else {
         navigate("/dashboard"); 
      }
    }
    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  // --- BAGIAN INI YANG HILANG SEBELUMNYA ---
  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };
  // ------------------------------------------

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl duration-300">
        <div className="p-8 relative">
          <Link to="/" className="absolute top-5 left-5 text-slate-600 hover:text-indigo-600 flex items-center gap-2 font-bold transition">
            <FaArrowLeft /> Home
          </Link>
          
          <div className="text-center mb-10 mt-8">
            <h1 className="text-3xl font-extrabold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Please sign in to your account</p>
          </div>
          
          {isError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 flex items-center">
              <span className="mr-2">⚠️</span> {message}
            </div>
          )}
          
          <form onSubmit={Auth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaEnvelope />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <FaSignInAlt /> Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition duration-200">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;