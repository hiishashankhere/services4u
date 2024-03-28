import express from "express";
import {
  createOrder,
  getOrders,
  createJobOrder,
  assignOrder,
} from "../controllers/order.js";
import { adminSide, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create/order", isAuthenticated, createOrder);
router.post("/create/order-job", createJobOrder);
router.get("/orders", isAuthenticated, adminSide, getOrders);
router.put("/assign/order", isAuthenticated, adminSide, assignOrder);

export default router;
