import crypto from "crypto";
import RazorpayOrder from "../models/razorpayOrder.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await RazorpayOrder.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id }
      );
      res.status(201).json({
        success: true,
        message: `order placed successfully Payment ID`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyJobPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const rzo = await RazorpayOrder.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id },
        { new: true }
      );
      const o = await Order.findById(rzo.receipt);
      await User.findByIdAndUpdate(o.user, { isPremium: true });
      await res.status(201).json({
        success: true,
        message: `order placed successfully Payment ID`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
