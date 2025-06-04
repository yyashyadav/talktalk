import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
  ALERT,
  MESSAGE_REACTION,
  MESSAGE_DELETE,
  MESSAGE_REPLY,
  MESSAGE_FORWARD
} from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

// Using Middlewares Here
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(ALERT, ({ chatId, members, background, sender }) => {
    if (background) {
      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(ALERT, {
        chatId,
        background,
        sender,
      });
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("REACT_TO_MESSAGE", async ({ messageId, chatId, emoji, members }) => {
    try {
      const message = await Message.findById(messageId)
        .populate('reactions.user', 'name')
        .populate('sender', 'name');

      if (!message) return;

      const existingReactionIndex = message.reactions.findIndex(
        r => r.user._id.toString() === user._id.toString() && r.emoji === emoji
      );

      if (existingReactionIndex > -1) {
        // Remove reaction
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Add new reaction
        message.reactions.push({
          user: user._id,
          emoji
        });
      }

      await message.save();

      // Fetch updated message with populated user details
      const updatedMessage = await Message.findById(messageId)
        .populate('reactions.user', 'name')
        .populate('sender', 'name');

      // Emit with complete user information
      const membersSocket = getSockets(members);
      io.to(membersSocket).emit("MESSAGE_REACTION", {
        messageId,
        reactions: updatedMessage.reactions.map(reaction => ({
          user: {
            _id: reaction.user._id,
            name: reaction.user.name
          },
          emoji: reaction.emoji
        })),
        chatId
      });
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  });

  socket.on(MESSAGE_DELETE, async ({ messageId, chatId, members }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (message.sender.toString() !== user._id.toString()) return;

      await message.deleteOne();

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(MESSAGE_DELETE, {
        messageId,
        chatId
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  socket.on("MESSAGE_FORWARD", async ({ messageId, toChatId, members }) => {
    try {
      const originalMessage = await Message.findById(messageId);
      if (!originalMessage) return;

      const newMessage = await Message.create({
        content: originalMessage.content,
        attachments: originalMessage.attachments,
        sender: user._id,
        chat: toChatId,
        isForwarded: true,
        forwardedFrom: originalMessage.chat
      });

      const messageForRealTime = {
        ...newMessage.toObject(),
        _id: newMessage._id,
        sender: {
          _id: user._id,
          name: user.name
        },
        createdAt: newMessage.createdAt
      };

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit("NEW_MESSAGE", {
        chatId: toChatId,
        message: messageForRealTime
      });
    } catch (error) {
      console.error("Error forwarding message:", error);
    }
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
});
export { envMode, adminSecretKey, userSocketIDs };

