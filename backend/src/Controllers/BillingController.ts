import { Request, Response } from "express";
import AsyncHandler from 'express-async-handler';
import User from '../models/User';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
  });
};

// @desc    Create Razorpay Order for Pro Subscription (₹3,200 / $40)
// @route   POST /api/billing/create-order
// @access  Private
export const createRazorpayOrder = AsyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;

  if (!userId) {
    res.status(401);
    throw new Error("User authentication required");
  }

  const instance = getRazorpayInstance();

  const options = {
    amount: 320000, // ₹3,200 in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: userId.toString()
    }
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
  });
});

// @desc    Verify Razorpay Payment Signature & Upgrade User to PRO
// @route   POST /api/billing/verify-payment
// @access  Private
export const verifyRazorpayPayment = AsyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment verification parameters");
  }

  // 1. Generate expected signature using HMAC SHA256
  const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", secret.trim())
    .update(body.toString())
    .digest("hex");

  console.log("--- RAZORPAY DEBUG ---");
  console.log("Secret used:", secret ? secret.substring(0, 4) + "..." : "MISSING");
  console.log("Expected Sig:", expectedSignature);
  console.log("Received Sig:", razorpay_signature);

  // 2. Verify signature
  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature verification failed");
  }

  // 3. Signature is valid! Upgrade User to PRO in MongoDB Atlas
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { tier: "PRO" },
    { new: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "🎉 Payment verified! Account upgraded to Hydra Pro.",
    user: updatedUser
  });
});