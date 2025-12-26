import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REEGISTER
export const Register = async(req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role || 'user'
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// LOGIN
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { email: req.body.email } });
        if(!user) return res.status(404).json({msg: "Email tidak ditemukan"});
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "Password Salah"});
        
        const userId = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        
        const accessToken = jwt.sign({userId, name, email, role}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d' 
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}

// ME (Cek User Login)
export const Me = async (req, res) => {
    try {
        const user = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'], 
            where: { uuid: req.userId } 
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// LOGOUT
export const logOut = (req, res) => {
    res.status(200).json({msg: "Anda telah logout"});
}