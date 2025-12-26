import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

// IMPORT SEMUA DASHBOARD
import AdminDashboard from "./admin/Dashboard";
import UserDashboard from "./user/UserDashboard";
import SueveyorDashboard from "./surveyor/SurveyorDashboard"; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  // TAMPILAN LOADING: hanya tampilkan spinner jika sedang memuat dan belum ada user
  if (isLoading && !user) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );
  }

  // --- LOGIKA PEMBAGIAN ROLE ---

  if (user.role === "admin") {
    return <AdminDashboard />;
  } 

  if (user.role === "user") {
    return <UserDashboard />;
  }

  if (user.role === "surveyor") {
     return <SueveyorDashboard />
  }

  // Fallback jika role aneh
  return <div className="text-center mt-10">Akses Ditolak: Role tidak dikenali ({user.role})</div>;
};

export default Dashboard;