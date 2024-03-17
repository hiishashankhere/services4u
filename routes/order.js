import express from "express";
import { createOrder } from "../controllers/order.js";
import { adminSide, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create/order", isAuthenticated, adminSide, createOrder);

export default router;
