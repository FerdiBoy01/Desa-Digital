import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

// IMPORT SEMUA DASHBOARD
import AdminDashboard from "./admin/Dashboard";     // Pastikan path ini benar
import UserDashboard from "./user/UserDashboard";   // Pastikan path ini benar
import SueveyorDashboard from "./surveyor/SurveyorDashboard";   // Pastikan path ini benar
// import SurveyorDashboard from "./surveyor/Dashboard"; // Jika ada dashboard surveyor

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  // TAMPILAN LOADING (Biar gak kedip ke admin dulu)
  if (isLoading || !user) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );
  }

  // --- LOGIKA PEMBAGIAN ROLE ---

  // 1. Jika Admin -> Tampilkan Dashboard Admin
  if (user.role === "admin") {
    return <AdminDashboard />;
  } 
  
  // 2. Jika User -> Tampilkan Dashboard User
  if (user.role === "user") {
    return <UserDashboard />;
  }

  // 3. Jika Surveyor (Opsional, jika belum ada file surveyor, arahkan kemana?)
  if (user.role === "surveyor") {
     // return <SurveyorDashboard />; 
     return <SueveyorDashboard />
  }

  // Fallback jika role aneh
  return <div className="text-center mt-10">Akses Ditolak: Role tidak dikenali ({user.role})</div>;
};

export default Dashboard;