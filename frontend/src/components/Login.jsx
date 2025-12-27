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

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* BAGIAN KIRI: FORM LOGIN */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              <FaArrowLeft className="mr-2" /> Kembali ke Beranda
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Silakan masuk ke akun Anda
            </p>
          </div>

          {isError && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0 text-red-400">⚠️</div>
                <div className="ml-3 text-sm text-red-700">{message}</div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={Auth} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Memproses..." : (
                      <span className="flex items-center gap-2">
                          <FaSignInAlt /> Masuk Sekarang
                      </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Belum punya akun?</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                 <Link to="/register" className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition">
                    Daftar Akun Baru
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: GAMBAR */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Office background"
        />
        <div className="absolute inset-0 bg-indigo-900 opacity-20 mix-blend-multiply"></div>
      </div>
    </div>
  );
};

export default Login;