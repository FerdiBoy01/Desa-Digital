import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Biodata = db.define('biodata', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: { notEmpty: true }
    },
    // --- DATA KEPENDUDUKAN ---
    nik: {
        type: DataTypes.STRING(16),
        allowNull: false, // Wajib diisi
        validate: { len: [16, 16] } // Harus 16 digit
    },
    no_kk: {
        type: DataTypes.STRING(16),
        allowNull: false, // Wajib diisi
        validate: { len: [16, 16] }
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
        allowNull: true
    },
    agama: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    // --- DATA EKONOMI (Penting untuk Bansos) ---
    pekerjaan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    penghasilan_bulanan: {
        type: DataTypes.INTEGER, // Disimpan dalam angka (Rupiah)
        allowNull: true,
        defaultValue: 0
    },
    jumlah_tanggungan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },

    // --- ALAMAT ---
    alamat_lengkap: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kabupaten: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    desa_kelurahan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kode_pos: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    no_handphone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },

    // --- STATUS BANTUAN LAIN (Cek Duplikasi Bantuan) ---
    penerima_pkh: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    penerima_bpnt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    // --- BUKTI DOKUMEN (Simpan nama file/URL saja) ---
    foto_ktp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_kk: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_rumah: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status_pengajuan: {
        type: DataTypes.ENUM('Menunggu', 'Disetujui', 'Ditolak'),
        defaultValue: 'Menunggu'
    },
    jenis_bantuan_dipilih: {
        type: DataTypes.STRING, // Contoh: "BLT BBM", "PKH", "Sembako"
        allowNull: true
    },
    catatan_admin: { // Opsional: Alasan penolakan/info
        type: DataTypes.TEXT,
        allowNull: true
    },
    // --- FIELD BARU: DATA DARI TIM SURVEYOR ---
    is_surveyed: { // Penanda apakah sudah disurvey
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    nama_surveyor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tgl_survey: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    foto_survey_lokasi: { // Foto User di depan rumah
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_survey_kondisi_rumah: { // Foto kondisi dalam/luar rumah
        type: DataTypes.STRING,
        allowNull: true
    },
    catatan_surveyor: { // Temuan lapangan
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Relasi User
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true }
    }
}, {
    freezeTableName: true
});

// Relasi
Users.hasOne(Biodata);
Biodata.belongsTo(Users, {foreignKey: 'userId'});

export default Biodata;