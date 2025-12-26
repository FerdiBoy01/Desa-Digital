import express from "express";
import { getRecipients, getPublicApproved } from "../controllers/Biodata.js"; 
import { getComments, createComment } from "../controllers/Comments.js";

const router = express.Router();

router.get('/public/recipients', getRecipients); 


router.get('/public/comments/:biodataId', getComments);
router.post('/public/comments', createComment);

export default router;