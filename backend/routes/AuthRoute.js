import express from "express";
// PASTIKAN 'Register' ADA DI DALAM KURUNG KURAWAL IMPORT
import { Login, logOut, Me, Register } from "../controllers/Auth.js"; 
import { verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/me', verifyToken, Me);
router.post('/login', Login);
router.post('/register', Register); // <-- Dan pastikan ini ada
router.delete('/logout', logOut);

export default router;