import mongoose from "mongoose";

const razorpayOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    amount_paid: {
      type: Number,
      default: 0,
    },
    amount_due: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
    razorpay_payment_id: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    notes: [String],
  },
  {
    timestamps: true,
  }
);

// Create Razorpay Order model
const RazorpayOrder = mongoose.model("RazorpayOrder", razorpayOrderSchema);

export default RazorpayOrder;
