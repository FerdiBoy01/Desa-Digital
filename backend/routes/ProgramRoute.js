import express from "express";
import { 
    getActivePrograms, getAllPrograms, 
    createProgram, updateProgram, deleteProgram 
} from "../controllers/ProgramController.js";
import { verifyToken, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Public (User Login)
router.get('/programs/active', verifyToken, getActivePrograms);

// Admin Only
router.get('/programs', verifyToken, adminOnly, getAllPrograms);
router.post('/programs', verifyToken, adminOnly, createProgram);
router.patch('/programs/:id', verifyToken, adminOnly, updateProgram);
router.delete('/programs/:id', verifyToken, adminOnly, deleteProgram);

export default router;