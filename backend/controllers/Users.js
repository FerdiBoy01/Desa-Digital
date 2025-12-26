import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

// GET ALL USERS (Hanya Admin)
export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// GET USER BY ID
export const getUserById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: { uuid: req.params.id }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// CREATE USER (Oleh Admin)
export const createUser = async(req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// UPDATE USER
export const updateUser = async(req, res) => {
    const user = await Users.findOne({ where: { uuid: req.params.id }});
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    
    // Cek apakah user update password atau tidak
    if(password === "" || password === null){
        hashPassword = user.password;
    } else {
        const salt = await bcrypt.genSalt();
        hashPassword = await bcrypt.hash(password, salt);
    }
    
    if(password !== confPassword && (password !== "" && password !== null)) 
        return res.status(400).json({msg: "Password tidak cocok"}); // Perbaikan logika
    
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// DELETE USER
export const deleteUser = async(req, res) => {
    const user = await Users.findOne({ where: { uuid: req.params.id }});
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    
    try {
        await Users.destroy({
            where: { uuid: req.params.id }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}