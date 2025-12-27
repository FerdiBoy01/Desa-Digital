import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(token == null) return res.status(401).json({msg: "Mohon login akun Anda!"});
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({msg: "Token invalid"});
        
        req.email = decoded.email;
        req.role = decoded.role;
        req.userId = decoded.userId; 
        next();
    });
}

export const adminOnly = async (req, res, next) => {
    if(req.role !== "admin") return res.status(403).json({msg: "Akses terlarang! Admin Only."});
    next();
}

export const surveyorOnly = async (req, res, next) => {
    const user = await Users.findOne({ where: { uuid: req.userId } });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.role !== "surveyor" && user.role !== "admin") return res.status(403).json({msg: "Akses terlarang! Khusus Tim Surveyor."});
    next();
}

export const adminOrSurveyor = async (req, res, next) => {
    try {
        const user = await Users.findOne({
            where: { uuid: req.userId }
        });
        
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        
        // --- DEBUGGING: LIHAT LOG DI TERMINAL VSCODE ---
        console.log("=== DEBUG MIDDLEWARE ===");
        console.log("User Login:", user.name);
        console.log("Role di Database:", user.role); 
        console.log("Apakah Admin?", user.role === "admin");
        console.log("Apakah Surveyor?", user.role === "surveyor");

        if(user.role !== "admin" && user.role !== "surveyor") {
            return res.status(403).json({msg: "Akses terlarang: Role Anda adalah " + user.role});
        }
        next();
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

// export const adminOrSurveyor = async (req, res, next) => {
//     try {
//         const user = await Users.findOne({
//             where: {
//                 uuid: req.userId
//             }
//         });
//         if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        
//         if(user.role !== "admin" && user.role !== "surveyor") {
//             return res.status(403).json({msg: "Akses terlarang: Khusus Admin atau Surveyor"});
//         }
//         next();
//     } catch (error) {
//         return res.status(500).json({msg: error.message});
//     }
// }