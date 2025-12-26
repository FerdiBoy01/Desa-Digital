import Biodata from "../models/BiodataModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const getMyBiodata = async(req, res) => {
    try {
        // 1. Cari User dulu berdasarkan UUID dari token
        const user = await Users.findOne({ where: { uuid: req.userId } });
        
        if(!user) return res.status(404).json({msg: "User tidak valid"});

        // 2. Baru cari Biodata berdasarkan ID Asli (Integer), bukan UUID
        const biodata = await Biodata.findOne({
            where: { userId: user.id }, // <--- INI PERBAIKANNYA (Pakai user.id, bukan req.userId)
            include: [{
                model: Users,
                attributes: ['name', 'email']
            }]
        });
        
        // Jika data kosong, return 404 (Ini wajar untuk user baru)
        if(!biodata) return res.status(404).json({msg: "Biodata belum diisi"});
        
        res.status(200).json(biodata);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- KHUSUS ADMIN: LIHAT SEMUA DATA ---
export const getAllBiodata = async(req, res) => {
    try {
        const response = await Biodata.findAll({
            include: [{
                model: Users,
                attributes: ['name', 'email'] // Ambil nama user pemilik data
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- KHUSUS ADMIN: LIHAT DETAIL SATU DATA ---
export const getBiodataById = async(req, res) => {
    try {
        const response = await Biodata.findOne({
            where: { uuid: req.params.id }, // Cari berdasarkan UUID Biodata
            include: [{
                model: Users,
                attributes: ['name', 'email']
            }]
        });
        if(!response) return res.status(404).json({msg: "Data tidak ditemukan"});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- UPDATE FUNGSI: VERIFIKASI ADMIN (DIPROTEKSI) ---
export const verifyBiodata = async(req, res) => {
    try {
        const biodata = await Biodata.findOne({ where: { uuid: req.params.id } });
        if(!biodata) return res.status(404).json({msg: "Data tidak ditemukan"});

        // PROTEKSI: Cek apakah sudah disurvey?
        if(!biodata.is_surveyed && req.body.status !== "Ditolak") { 
            // Admin BOLEH Menolak walau belum survey (misal data user ngaco banget)
            // Tapi TIDAK BOLEH Menyetujui sebelum survey
            if(req.body.status === "Disetujui") {
                return res.status(400).json({msg: "Gagal! Data belum diverifikasi oleh Tim Surveyor."});
            }
        }

        // ... kode update status yang lama ...
        const { status, catatan } = req.body;
        await Biodata.update({ status_pengajuan: status, catatan_admin: catatan }, { where: { uuid: req.params.id } });
        res.status(200).json({msg: `Pengajuan berhasil ${status}`});

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- FUNGSI BARU: SURVEYOR SUBMIT DATA ---
export const submitSurvey = async(req, res) => {
    try {
        const biodata = await Biodata.findOne({ where: { uuid: req.params.id } });
        if(!biodata) return res.status(404).json({msg: "Data tidak ditemukan"});

        // Handle File Upload (Logic sama seperti upload user)
        let fotoLokasiName = null;
        let fotoKondisiName = null;

        const handleFileUpload = (file) => {
            const ext = path.extname(file.name);
            const fileName = file.md5 + Date.now() + ext; // Tambah timestamp biar unik
            file.mv(`./public/uploads/${fileName}`);
            return fileName;
        };

        if(req.files) {
            if(req.files.foto_survey_lokasi) 
                fotoLokasiName = handleFileUpload(req.files.foto_survey_lokasi);
            if(req.files.foto_survey_kondisi_rumah) 
                fotoKondisiName = handleFileUpload(req.files.foto_survey_kondisi_rumah);
        }

        // Cari nama surveyor dari token login
        const surveyor = await Users.findOne({ where: { uuid: req.userId } });

        await Biodata.update({
            is_surveyed: true,
            nama_surveyor: surveyor.name,
            tgl_survey: new Date(),
            foto_survey_lokasi: fotoLokasiName,
            foto_survey_kondisi_rumah: fotoKondisiName,
            catatan_surveyor: req.body.catatan_surveyor
        }, {
            where: { uuid: req.params.id }
        });

        res.status(200).json({msg: "Laporan Survey Berhasil Diupload"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateBiodata = async(req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.userId } });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        let biodata = await Biodata.findOne({ where: { userId: user.id } });
        
        // --- FUNGSI HELPER UNTUK HANDLE UPLOAD ---
        const handleFileUpload = (file, oldFileName) => {
            if(!file) return oldFileName; // Jika gak ada file baru, pakai yg lama
            
            const ext = path.extname(file.name);
            const fileName = file.md5 + ext; // Buat nama unik
            const allowedType = ['.png','.jpg','.jpeg'];

            if(!allowedType.includes(ext.toLowerCase())) {
                throw new Error("Invalid Image Type");
            }
            if(file.data.length > 5000000) { // Max 5MB
                throw new Error("Image must be less than 5 MB");
            }

            // Pindahkan file ke folder public/uploads
            file.mv(`./public/uploads/${fileName}`, (err) => {
                if(err) throw new Error(err.message);
            });
            
            // Hapus file lama jika ada (optional, biar hemat storage)
            if(oldFileName && fs.existsSync(`./public/uploads/${oldFileName}`)) {
                try { fs.unlinkSync(`./public/uploads/${oldFileName}`); } catch(e){}
            }

            return fileName;
        };

        
        

        // --- PROSES FILE ---
        let ktpName = biodata?.foto_ktp || null;
        let kkName = biodata?.foto_kk || null;
        let rumahName = biodata?.foto_rumah || null;

        if (req.files) {
            try {
                if(req.files.foto_ktp) ktpName = handleFileUpload(req.files.foto_ktp, ktpName);
                if(req.files.foto_kk) kkName = handleFileUpload(req.files.foto_kk, kkName);
                if(req.files.foto_rumah) rumahName = handleFileUpload(req.files.foto_rumah, rumahName);
            } catch (error) {
                return res.status(422).json({msg: error.message});
            }
        }

        // --- SIAPKAN DATA UPDATE ---
        // Ambil text data dari req.body
        const {
            nik, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, agama,
            pekerjaan, penghasilan_bulanan, jumlah_tanggungan,
            alamat_lengkap, provinsi, kabupaten, kecamatan, desa_kelurahan, kode_pos, no_handphone,
            penerima_pkh, penerima_bpnt, jenis_bantuan_dipilih
        } = req.body;

        const dataInput = {
            nik, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, agama,
            pekerjaan, penghasilan_bulanan, jumlah_tanggungan,
            alamat_lengkap, provinsi, kabupaten, kecamatan, desa_kelurahan, kode_pos, no_handphone,
            penerima_pkh: penerima_pkh === 'true' || penerima_pkh === true, // Konversi string "true" jadi boolean
            penerima_bpnt: penerima_bpnt === 'true' || penerima_bpnt === true,
            foto_ktp: ktpName,   // <--- Simpan nama file
            foto_kk: kkName,     // <--- Simpan nama file
            foto_rumah: rumahName,
            jenis_bantuan_dipilih,
            status_pengajuan: 'Menunggu', // <--- Simpan nama file
            userId: user.id
        };

        if(!biodata) {
            await Biodata.create(dataInput);
            res.status(201).json({msg: "Data & Foto berhasil disimpan"});
        } else {
            await Biodata.update(dataInput, { where: { userId: user.id } });
            res.status(200).json({msg: "Data & Foto berhasil diperbarui"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
}

// ... fungsi lainnya ...

// --- PUBLIC: LIST PENERIMA BANTUAN (TANPA LOGIN) ---
export const getPublicApproved = async(req, res) => {
    try {
        const response = await Biodata.findAll({
            where: { 
                status_pengajuan: 'Disetujui' // Hanya yang disetujui
            },
            attributes: ['uuid', 'jenis_bantuan_dipilih', 'desa_kelurahan', 'catatan_admin', 'updatedAt'], // Ambil kolom penting saja
            include: [{
                model: Users,
                attributes: ['name'] // Ambil nama user
            }],
            order: [['updatedAt', 'DESC']], // Urutkan dari yang terbaru
            limit: 10 // Batasi 10 orang terakhir agar tidak berat
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- LAPORAN RESMI (DESA KE KABUPATEN) ---
export const getReportData = async(req, res) => {
    try {
        const { tahun } = req.query; // Bisa filter by tahun (optional)
        
        const whereClause = {
            status_pengajuan: 'Disetujui' // HANYA YANG DISETUJUI
        };

        if(tahun) {
            whereClause.tahun_periode = tahun;
        }

        const response = await Biodata.findAll({
            where: whereClause,
            include: [{
                model: Users,
                attributes: ['name']
            }],
            order: [
                ['jenis_bantuan_dipilih', 'ASC'], // Kelompokkan per jenis bantuan
                ['desa_kelurahan', 'ASC'],        // Urutkan per desa
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}