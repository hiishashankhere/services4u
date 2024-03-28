import mongoose from "mongoose";

export const schema = new mongoose.Schema(
  {
    order: {
      // job is created for order model that have all the info we needed to get order/job done
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    assignedTo: {
      // which user is this job assigned to get the order/job done
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", schema);
