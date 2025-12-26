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

    nik: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: { len: [16, 16] }
    },
    no_kk: {
        type: DataTypes.STRING(16),
        allowNull: false,
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
    
    pekerjaan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    penghasilan_bulanan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    jumlah_tanggungan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },

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

    penerima_pkh: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    penerima_bpnt: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
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
        type: DataTypes.STRING,
        allowNull: true
    },
    catatan_admin: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    is_surveyed: {
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
    foto_survey_lokasi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_survey_kondisi_rumah: {
        type: DataTypes.STRING,
        allowNull: true
    },
    catatan_surveyor: { 
        type: DataTypes.TEXT,
        allowNull: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true }
    }
}, {
    freezeTableName: true
});

Users.hasOne(Biodata);
Biodata.belongsTo(Users, {foreignKey: 'userId'});

export default Biodata;