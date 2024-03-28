import express from "express";
import { verifyPayment, verifyJobPayment } from "../controllers/payment.js";

const router = express.Router();

router.post("/payment/verify", verifyPayment);
router.post("/payment/verify-job", verifyJobPayment);

export default router;
