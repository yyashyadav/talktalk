import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
  handleFileUpload,
  deletFilesFromCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new user and save it to the database and save token in cookie
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;
  let avatar;

  if (file) {
    const result = await uploadFilesToCloudinary([file]);
    avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };
  } else {
    // Default avatar when no file is uploaded
    avatar = {
      public_id: "default_avatar",
      url: "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random",
    };
  }

  // Default quotes for bio if not provided
  const defaultQuotes = [
    "Life is what happens when you're busy making other plans.",
    "The only way to do great work is to love what you do.",
    "In the middle of every difficulty lies opportunity.",
    "Be the change you wish to see in the world.",
    "The journey of a thousand miles begins with one step.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Happiness is not something ready made. It comes from your own actions.",
    "The best way to predict the future is to create it.",
    "Life is really simple, but we insist on making it complicated.",
    "The only limit to our realization of tomorrow is our doubts of today."
  ];

  // Get a random quote based on username length (for some variety)
  const randomIndex = username.length % defaultQuotes.length;
  const userBio = bio || defaultQuotes[randomIndex];

  const user = await User.create({
    name,
    bio: userBio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});

// Login user and save token in cookie
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("mechat-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name = "" } = req.query;

  // Finding All my chats
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  //  extracting All Users from my chats means friends or people I have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Finding all users except me and my friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Handle text fields
    const fieldsToUpdate = ['name', 'bio', 'email', 'phone', 'location', 'language'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle avatar update if provided
    if (req.file) {
      const result = await uploadFilesToCloudinary([req.file]);
      if (result && result[0]) {
        // Delete old avatar if exists
        if (user.avatar?.public_id) {
          await deletFilesFromCloudinary([user.avatar.public_id]);
        }
        user.avatar = {
          public_id: result[0].public_id,
          url: result[0].url
        };
      }
    }

    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        language: user.language,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error updating profile",
      error: error.message 
    });
  }
};

export const deleteAccount = TryCatch(async (req, res, next) => {
  const userId = req.user;

  try {
    // Start with deleting messages
    await Message.updateMany(
      { sender: userId },
      { 
        $set: { 
          content: "This message was deleted",
          attachments: [],
          isDeleted: true 
        } 
      }
    );

    // Get all chats where user is a member
    const userChats = await Chat.find({ members: userId });

    // Process each chat
    for (const chat of userChats) {
      if (chat.groupChat) {
        // If it's a group chat, just remove the user
        await Chat.findByIdAndUpdate(chat._id, {
          $pull: { members: userId }
        });
      } else {
        // If it's a one-on-one chat, delete it
        await Chat.findByIdAndDelete(chat._id);
      }
    }

    // Delete all friend requests
    await Request.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Get user to delete avatar
    const user = await User.findById(userId);
    
    // Delete user's avatar from cloudinary if exists
    if (user && user.avatar?.public_id) {
      await deletFilesFromCloudinary([user.avatar.public_id]);
    }

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    // Clear auth cookie
    res.cookie("mechat-token", "", {
      maxAge: 0,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return next(new ErrorHandler("Failed to delete account", 500));
  }
});

export {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
};
