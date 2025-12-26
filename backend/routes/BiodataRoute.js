import express from "express";
import { getMyBiodata, updateBiodata, getAllBiodata, getBiodataById, getPublicApproved, getReportData } from "../controllers/Biodata.js";
import { verifyBiodata } from "../controllers/Biodata.js";
import { verifyToken, adminOnly, surveyorOnly, adminOrSurveyor } from "../middleware/AuthUser.js";
import { submitSurvey } from "../controllers/Biodata.js";

const router = express.Router();

// User Biasa
router.get('/biodata', verifyToken, getMyBiodata);
router.post('/biodata', verifyToken, updateBiodata);
router.get('/public/recipients', getPublicApproved);

// Admin Only
router.get('/biodata/all', verifyToken, adminOrSurveyor, getAllBiodata);
router.get('/biodata/:id', verifyToken, adminOrSurveyor, getBiodataById);
router.patch('/biodata/verify/:id', verifyToken, adminOnly, verifyBiodata);
router.patch('/biodata/survey/:id', verifyToken, surveyorOnly, submitSurvey);


router.get('/reports/approved', verifyToken, adminOnly, getReportData);

export default router;