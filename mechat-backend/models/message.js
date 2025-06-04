import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    content: String,
    messageType: {
      type: String,
      enum: ['text', 'system'],
      default: 'text'
    },
    systemType: {
      type: String,
      enum: ['background_change', 'group_update', null],
      default: null
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    reactions: [{
      user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      emoji: {
        type: String,
        required: true,
      }
    }],
    replyTo: {
      type: Types.ObjectId,
      ref: "Message",
      default: null
    },
    isForwarded: {
      type: Boolean,
      default: false
    },
    forwardedFrom: {
      type: Types.ObjectId,
      ref: "Chat",
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// Add a pre-find middleware to always populate reactions.user
schema.pre('find', function() {
  this.populate('reactions.user', 'name');
});

export const Message = mongoose.models.Message || model("Message", schema);
