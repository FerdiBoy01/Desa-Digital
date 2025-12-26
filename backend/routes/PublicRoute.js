import express from "express";
// Import controller getRecipients
import { getRecipients, getPublicApproved } from "../controllers/Biodata.js"; 
import { getComments, createComment } from "../controllers/Comments.js";

const router = express.Router();

// --- PASTIKAN INI MENGARAH KE getRecipients ---
router.get('/public/recipients', getRecipients); 
// (Kalau mengarah ke getPublicApproved, komentarnya tidak akan terbawa!)

router.get('/public/comments/:biodataId', getComments);
router.post('/public/comments', createComment);

export default router;