import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Program = db.define('programs', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: { notEmpty: true }
    },
    nama_program: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    periode: { // Contoh: "Januari 2025"
        type: DataTypes.STRING,
        allowNull: true
    },
    isOpen: { // Status: true (Buka), false (Tutup)
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true
});

export default Program;