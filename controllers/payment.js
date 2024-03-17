import crypto from "crypto";
import RazorpayOrder from "../models/razorpayOrder.js";

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
