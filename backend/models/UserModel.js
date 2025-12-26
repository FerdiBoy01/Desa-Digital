import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4, // Generate ID acak otomatis (lebih aman dari angka urut)
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100] // Minimal 3 karakter
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true // Validasi format email otomatis
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        // ENUM memastikan hanya 3 nilai ini yang bisa masuk ke database
        type: DataTypes.ENUM('admin', 'user', 'surveyor'), 
        allowNull: false,
        defaultValue: 'user', // Default role jika tidak diisi
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true // Agar nama tabel tetap 'users' (bukan userss)
});

export default Users;