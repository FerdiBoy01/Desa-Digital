import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Biodata from "./BiodataModel.js"; // Pastikan path ini benar

const { DataTypes } = Sequelize;

const Comments = db.define('comments', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: { notEmpty: true }
    },
    nama_pelapor: { // Nama warga yang melapor/komen
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    isi_laporan: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
    },
    biodataId: { // Terhubung ke Penerima Bantuan
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true }
    }
}, {
    freezeTableName: true
});

// Relasi: 1 Penerima bisa punya banyak Komentar
Biodata.hasMany(Comments, {foreignKey: 'biodataId'});
Comments.belongsTo(Biodata, {foreignKey: 'biodataId'});

export default Comments;