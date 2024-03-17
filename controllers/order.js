import Razorpay from "razorpay";
import { Order } from "../models/order.js";
import RazorpayOrder from "../models/razorpayOrder.js";

export const createOrder = async (req, res) => {
  try {
    const { services, price } = req.body;
    const userId = req.user._id;

    const order = await Order.create({
      services,
      price,
      user: userId,
    });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const { id, ...data } = await instance.orders.create({
      amount: Math.floor(price) * 100,
      currency: "INR",
      receipt: order._id,
    });

    await RazorpayOrder.create({ orderId: id, ...data });

    res.status(201).json({
      success: true,
      message: "service added successfully",
      razorpayOrder: { id, ...data },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Populate all fields of the order including referenced fields
    const orders = await Order.find().populate("services").populate("user"); // Populate user field, exclude password and email

    res.status(200).json({
      success: true,
      message: "success",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
