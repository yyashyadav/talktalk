import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    background: {
      type: {
        type: String,
        enum: ["color", "image", "default"],
        default: "default",
      },
      value: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Chat =mongoose.models.Chat || model("Chat", schema);
