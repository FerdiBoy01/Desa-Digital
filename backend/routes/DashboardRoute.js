import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { verifyToken, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Hanya Admin yang boleh lihat statistik ini
router.get('/dashboard/stats', verifyToken, adminOnly, getDashboardStats);

export default router;