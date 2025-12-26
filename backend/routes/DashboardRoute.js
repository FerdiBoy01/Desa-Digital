import express from "express";
import { getDashboardStats } from "../controllers/DashboardController.js";
import { verifyToken, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/dashboard/stats', verifyToken, adminOnly, getDashboardStats);

export default router;