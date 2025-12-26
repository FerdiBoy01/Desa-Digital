import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyToken, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Semua route di bawah ini diproteksi: harus login DAN harus admin
router.get('/users', verifyToken, adminOnly, getUsers);
router.get('/users/:id', verifyToken, adminOnly, getUserById);
router.post('/users', verifyToken, adminOnly, createUser);
router.patch('/users/:id', verifyToken, adminOnly, updateUser);
router.delete('/users/:id', verifyToken, adminOnly, deleteUser);

export default router;