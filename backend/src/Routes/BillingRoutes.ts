import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../Controllers/BillingController';
import { protect } from '../Middlewares/AuthMiddleware';

const router = express.Router();

// 1. Create Razorpay order
router.post('/create-order', protect, createRazorpayOrder);

// 2. Verify Razorpay signature & upgrade user to PRO
router.post('/verify-payment', protect, verifyRazorpayPayment);

export default router;