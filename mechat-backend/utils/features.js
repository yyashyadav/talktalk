import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 1 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  console.log("Attempting to connect to MongoDB...");
  console.log("Connection string format check:", uri.includes("mongodb+srv://"));
  
  mongoose
    .connect(uri, { 
      dbName: "meChatDB",

      // retryWrites: true,
    //   You are sending a message to a friend via WhatsApp. You hit Send, but suddenly the internet disconnects for 1 second.  WhatsApp automatically tries again in the background without telling you.
    // Then the message goes through.

      retryWrites: true,
      // MongoDB waits for most of your servers to confirm the write before it says “Done.”
      w: "majority",

      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })
    .then((data) => {
      console.log(`Successfully connected to MongoDB Atlas!`);
      console.log(`Host: ${data.connection.host}`);
      console.log(`Database: ${data.connection.name}`);
      return data;
    })
    .catch((err) => {
      console.error("\nMongoDB Connection Error Details:");
      console.error("Error Name:", err.name);
      console.error("Error Message:", err.message);
      if (err.code) console.error("Error Code:", err.code);
      if (err.codeName) console.error("Error Code Name:", err.codeName);
      
      // Additional debugging for common issues
      if (err.name === 'MongoServerSelectionError') {
        console.error("\nPossible causes:");
        console.error("1. IP address not whitelisted in MongoDB Atlas");
        console.error("2. Network connectivity issues");
        console.error("3. Invalid connection string format");
      } else if (err.name === 'MongoParseError') {
        console.error("\nPossible causes:");
        console.error("1. Invalid connection string format");
        console.error("2. Special characters in username/password not properly encoded");
      }
      
      throw err;
    });
};
//create the user in stream also
// and connect to the stream
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("mechat-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};

const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary
};

export const handleFileUpload = async (file) => {
  try {
    if (!file) return null;

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.originalname}`;

    // For now, we'll use a simple approach
    // In production, you'd want to save this to a proper storage service
    const result = await uploadFilesToCloudinary([file]);
    console.log(result);
    
    return {
      public_id: filename,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};
