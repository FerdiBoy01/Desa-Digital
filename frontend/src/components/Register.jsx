import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser, reset } from "../features/authSlice";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

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
    <div className="min-h-screen flex bg-white">
      
      {/* BAGIAN KIRI: GAMBAR (Dibalik posisinya dengan Login agar variatif) */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Teamwork"
        />
        <div className="absolute inset-0 bg-slate-900 opacity-30 mix-blend-multiply"></div>
        <div className="absolute bottom-10 left-10 p-6 text-white z-10">
            <h3 className="text-3xl font-bold">Bergabung Bersama Kami</h3>
            <p className="mt-2 text-slate-200">Mulai perjalanan Anda dengan membuat akun baru hari ini.</p>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM REGISTER */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-slate-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Buat Akun Baru</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login di sini
              </Link>
            </p>
          </div>

          {isError && (
             <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
               {message}
             </div>
          )}

          <div className="mt-8">
            <form onSubmit={Auth} className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                     <FaUser />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                     <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Password</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <FaLock />
                          </div>
                          <input
                            type="password"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <FaCheckCircle />
                          </div>
                          <input
                            type="password"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                            placeholder="••••••••"
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                          />
                      </div>
                  </div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                >
                  {isLoading ? "Creating Account..." : (
                      <span className="flex items-center gap-2">
                        Daftar Sekarang <FaArrowRight className="text-xs" />
                      </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;