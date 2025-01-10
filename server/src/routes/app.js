
import express from 'express';
import { createPDF } from '../controller/app.controller';

const router = express.Router();

// Route để tạo PDF
router.post('/create-pdf', createPDF);

export default router;