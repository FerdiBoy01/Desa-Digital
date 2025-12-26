import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import Welcome from "./components/Welcome"; // <-- Import Welcome
import Users from "./pages/admin/Users";
import AddUser from "./pages/admin/AddUser"; // <--- Import ini
import EditUser from "./pages/admin/EditUser"; // <--- Import ini
import FormPengajuan from "./pages/user/FormPengajuan";
import SurveyRepository from "./pages/admin/SurveyRepository";
import SurveyDetail from "./pages/admin/SurveyDetail";
import ManageProgram from "./pages/admin/ManageProgram";
import SurveyorDashboard from "./pages/surveyor/SurveyorDashboard";
import InputSurvey from "./pages/surveyor/InputSurvey";
import SuratPersetujuan from "./pages/user/SuratPersetujuan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Utama sekarang ke Welcome Page */}
        <Route path="/" element={<Welcome />} />
        
        {/* Route Login kita pindahkan ke /login */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />} />

       {/* Route User Management */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/add" element={<AddUser />} /> {/* Route Add */}
        <Route path="/users/edit/:id" element={<EditUser />} /> {/* Route Edit (Pakai parameter :id) */}
        <Route path="/surveys" element={<SurveyRepository />} />
        <Route path="/surveys/detail/:id" element={<SurveyDetail />} />
        <Route path="/programs" element={<ManageProgram />} />

        {/* Route Form Bansos */}
        <Route path="/pengajuan/form" element={<FormPengajuan />} />
        <Route path="/cetak-bukti" element={<SuratPersetujuan />} />

        <Route path="/surveyor/dashboard" element={<SurveyorDashboard />} />
        <Route path="/surveyor/input/:id" element={<InputSurvey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;