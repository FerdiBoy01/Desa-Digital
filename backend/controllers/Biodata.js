import Biodata from "../models/BiodataModel.js";
import Users from "../models/UserModel.js";
import Comments from "../models/CommentModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

// --- USER: AMBIL DATA SENDIRI ---
export const getMyBiodata = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.userId } });
        if (!user) return res.status(404).json({ msg: "User tidak valid" });

        const biodata = await Biodata.findOne({
            where: { userId: user.id },
            include: [{
                model: Users,
                attributes: ['name', 'email']
            }]
        });

        if (!biodata) return res.status(404).json({ msg: "Biodata belum diisi" });
        res.status(200).json(biodata);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- PUBLIC: LIST PENERIMA (HALAMAN DEPAN) ---
export const getRecipients = async (req, res) => {
    try {
        const response = await Biodata.findAll({
            where: { status_pengajuan: 'Disetujui' },
            attributes: ['id', 'uuid', 'desa_kelurahan', 'jenis_bantuan_dipilih', 'updatedAt'],
            include: [
                {
                    model: Users,
                    attributes: ['name']
                },
                {
                    model: Comments,
                    attributes: ['nama_pelapor', 'isi_laporan', 'createdAt']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- ADMIN: LIHAT SEMUA DATA ---
export const getAllBiodata = async (req, res) => {
    try {
        const response = await Biodata.findAll({
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email']
                },
                {
                    model: Comments,
                    attributes: ['id']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- ADMIN: LIHAT DETAIL SATU DATA ---
export const getBiodataById = async (req, res) => {
    try {
        const response = await Biodata.findOne({
            where: { uuid: req.params.id },
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email']
                },
                {
                    model: Comments,
                    attributes: ['nama_pelapor', 'isi_laporan', 'createdAt']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- USER: UPDATE / CREATE BIODATA ---
export const updateBiodata = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { uuid: req.userId } });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        let biodata = await Biodata.findOne({ where: { userId: user.id } });

        const handleFileUpload = (file, oldFileName) => {
            if (!file) return oldFileName;

            const ext = path.extname(file.name);
            const fileName = file.md5 + Date.now() + ext;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) throw new Error("Tipe file harus JPG/PNG");
            if (file.size > 5000000) throw new Error("Ukuran file maksimal 5 MB");

            file.mv(`./public/uploads/${fileName}`);

            if (oldFileName && fs.existsSync(`./public/uploads/${oldFileName}`)) {
                fs.unlinkSync(`./public/uploads/${oldFileName}`);
            }

            return fileName;
        };

        let ktpName = biodata?.foto_ktp || null;
        let kkName = biodata?.foto_kk || null;
        let rumahName = biodata?.foto_rumah || null;

        if (req.files) {
            if (req.files.foto_ktp) ktpName = handleFileUpload(req.files.foto_ktp, ktpName);
            if (req.files.foto_kk) kkName = handleFileUpload(req.files.foto_kk, kkName);
            if (req.files.foto_rumah) rumahName = handleFileUpload(req.files.foto_rumah, rumahName);
        }

        const {
            nik, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, agama,
            pekerjaan, penghasilan_bulanan, jumlah_tanggungan,
            alamat_lengkap, provinsi, kabupaten, kecamatan, desa_kelurahan,
            kode_pos, no_handphone, penerima_pkh, penerima_bpnt,
            jenis_bantuan_dipilih
        } = req.body;

        const dataInput = {
            nik, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, agama,
            pekerjaan, penghasilan_bulanan, jumlah_tanggungan,
            alamat_lengkap, provinsi, kabupaten, kecamatan, desa_kelurahan,
            kode_pos, no_handphone,
            penerima_pkh: penerima_pkh === 'true' || penerima_pkh === true,
            penerima_bpnt: penerima_bpnt === 'true' || penerima_bpnt === true,
            foto_ktp: ktpName,
            foto_kk: kkName,
            foto_rumah: rumahName,
            jenis_bantuan_dipilih,
            userId: user.id
        };

        if (!biodata) {
            dataInput.status_pengajuan = 'Menunggu';
            await Biodata.create(dataInput);
            res.status(201).json({ msg: "Data Berhasil Disimpan" });
        } else {
            await Biodata.update(dataInput, { where: { userId: user.id } });
            res.status(200).json({ msg: "Data Berhasil Diperbarui" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- ADMIN: VERIFIKASI DATA ---
export const verifyBiodata = async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ where: { uuid: req.params.id } });
        if (!biodata) return res.status(404).json({ msg: "Data tidak ditemukan" });

        if (!biodata.is_surveyed && req.body.status === "Disetujui") {
            return res.status(400).json({ msg: "Data belum disurvey" });
        }

        const { status, catatan } = req.body;
        await Biodata.update(
            { status_pengajuan: status, catatan_admin: catatan },
            { where: { uuid: req.params.id } }
        );

        res.status(200).json({ msg: `Pengajuan berhasil ${status}` });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- SURVEYOR: SUBMIT LAPORAN ---
export const submitSurvey = async (req, res) => {
    try {
        const biodata = await Biodata.findOne({ where: { uuid: req.params.id } });
        if (!biodata) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const handleFileUpload = (file) => {
            const ext = path.extname(file.name);
            const fileName = file.md5 + Date.now() + ext;
            file.mv(`./public/uploads/${fileName}`);
            return fileName;
        };

        let fotoLokasiName = null;
        let fotoKondisiName = null;

        if (req.files) {
            if (req.files.foto_survey_lokasi)
                fotoLokasiName = handleFileUpload(req.files.foto_survey_lokasi);
            if (req.files.foto_survey_kondisi_rumah)
                fotoKondisiName = handleFileUpload(req.files.foto_survey_kondisi_rumah);
        }

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

        res.status(200).json({ msg: "Laporan Survey Berhasil Diupload" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- PUBLIC: 10 PENERIMA TERAKHIR ---
export const getPublicApproved = async (req, res) => {
    try {
        const response = await Biodata.findAll({
            where: { status_pengajuan: 'Disetujui' },
            attributes: ['uuid', 'jenis_bantuan_dipilih', 'desa_kelurahan', 'catatan_admin', 'updatedAt'],
            include: [{
                model: Users,
                attributes: ['name']
            }],
            order: [['updatedAt', 'DESC']],
            limit: 10
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// --- ADMIN: LAPORAN DATA ---
export const getReportData = async (req, res) => {
    try {
        const { tahun } = req.query;
        const whereClause = { status_pengajuan: 'Disetujui' };
        if (tahun) whereClause.tahun_periode = tahun;

        const response = await Biodata.findAll({
            where: whereClause,
            include: [{
                model: Users,
                attributes: ['name']
            }],
            order: [
                ['jenis_bantuan_dipilih', 'ASC'],
                ['desa_kelurahan', 'ASC']
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
