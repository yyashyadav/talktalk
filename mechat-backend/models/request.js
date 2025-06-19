import mongoose, { Schema, model, Types } from "mongoose";


const schema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },

    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // so we use timestamps to track when the request was created and updated
  // and we use the status field to track the state of the request
    timestamps: true,
  }
);

export const Request = mongoose.models.Request || model("Request", schema);
