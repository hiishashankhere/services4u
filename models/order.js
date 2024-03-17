import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    done: {
      type: Boolean,
      default: false,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    price: {
      type: Number,
      required: [true, "please enter the charges"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
