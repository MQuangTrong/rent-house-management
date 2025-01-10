import express from 'express';
import { createPaymentRequest, handleVnpayReturn } from '../controller/payment.controller';

const router = express.Router();

router.post('/create-payment', createPaymentRequest);

export default router;
