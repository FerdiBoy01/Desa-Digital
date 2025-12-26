# 🇮🇩 BansosKita - Sistem Informasi Penyaluran Bantuan Sosial Desa

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![React](https://img.shields.io/badge/Frontend-React_Vite-cyan) ![Node](https://img.shields.io/badge/Backend-Node.js_Express-green) ![Database](https://img.shields.io/badge/Database-MySQL-orange)

**BansosKita** adalah aplikasi berbasis web yang dirancang untuk membantu pemerintah desa dalam mendata, memverifikasi, dan menyalurkan bantuan sosial (Bansos) secara transparan, akuntabel, dan tepat sasaran. Aplikasi ini mencakup fitur validasi lapangan oleh Surveyor dan fitur *Social Control* (Transparansi) bagi masyarakat umum.

---

## 🌟 Fitur Unggulan

### 1. 📢 Transparansi & Kontrol Sosial (Public)
* **Landing Page Informatif:** Informasi alur pendaftaran dan statistik penyaluran.
* **Dinding Transparansi:** Daftar penerima bantuan yang disetujui dapat diakses publik.
* **Fitur Laporan Warga:** Masyarakat dapat memberikan komentar/laporan pada data penerima yang dianggap tidak layak (Social Control), menjaga data tetap valid.

### 2. 🏠 Warga (Pemohon)
* **Registrasi Mandiri:** Warga dapat mendaftar akun menggunakan NIK.
* **Pengajuan Bantuan:** Form input data ekonomi, domisili, dan upload dokumen (KTP, KK, Foto Rumah).
* **Tracking Status:** Memantau status pengajuan (Menunggu -> Disurvey -> Disetujui/Ditolak).

### 3. 🕵️ Surveyor (Tim Lapangan)
* **Dashboard Tugas:** Melihat daftar warga yang perlu dikunjungi.
* **Input Hasil Survey:** Mengisi catatan lapangan dan mengupload foto bukti kondisi rumah & lokasi terkini (Geo-tagging context).

### 4. 👑 Administrator (Pemerintah Desa)
* **Dashboard Statistik:** Grafik real-time penyaluran bantuan.
* **Manajemen User:** Mengelola akun Admin, Surveyor, dan Warga.
* **Verifikasi Data:**
    * Melihat detail lengkap pemohon.
    * Melihat hasil validasi Surveyor.
    * **Peringatan Dini:** Notifikasi otomatis jika ada laporan negatif dari warga sebelum menyetujui data.
* **Cetak Laporan:** Export data ke format Excel/PDF untuk laporan ke dinas terkait.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan arsitektur **MERN/PERN Stack** (MySQL):

* **Frontend:**
    * [React.js](https://reactjs.org/) - UI Library.
    * [Redux Toolkit](https://redux-toolkit.js.org/) - State Management.
    * [Tailwind CSS](https://tailwindcss.com/) - Styling Framework.
    * [Axios](https://axios-http.com/) - API Client.
    * [React Icons](https://react-icons.github.io/react-icons/) - Icon set.

* **Backend:**
    * [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Server Framework.
    * [Sequelize ORM](https://sequelize.org/) - Database Management.
    * [MySQL](https://www.mysql.com/) - Database Relasional.
    * [Express-Fileupload](https://www.npmjs.com/package/express-fileupload) - Handling file uploads.

---

## 🚀 Panduan Instalasi (Localhost)

Ikuti langkah berikut untuk menjalankan project di komputer Anda.

### Prasyarat
* Node.js (v16 atau terbaru)
* MySQL Server (XAMPP / Laragon)

### 1. Setup Backend (Server)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat database di phpMyAdmin bernama 'bansos_db' (sesuaikan dengan .env)

# Jalankan Server (akan otomatis create table)
nodemon index