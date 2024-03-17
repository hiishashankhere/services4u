import express from "express";
import { createOrder, getOrders } from "../controllers/order.js";
import { adminSide, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create/order", isAuthenticated, createOrder);
router.get("/orders", isAuthenticated, adminSide, getOrders);

export default router;
