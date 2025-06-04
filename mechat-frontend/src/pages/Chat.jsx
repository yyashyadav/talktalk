import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, ClickAwayListener, Box } from "@mui/material";
import { grayColor, orange, chatBgPattern, myblue } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Wallpaper as WallpaperIcon,
  EmojiEmotions as EmojiIcon
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import ChatBackgroundDialog from "../components/dialogs/ChatBackgroundDialog";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  MESSAGE_DELETE,
  MESSAGE_REACTED,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';
import ChatHeader from "../components/specific/ChatHeader";
import { red } from "@mui/material/colors";
import VoiceRecorder from '../components/specific/VoiceRecorder';


const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [isBgDialogOpen, setIsBgDialogOpen] = useState(false);
  const [chatBackground, setChatBackground] = useState(chatBgPattern);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const [replyTo, setReplyTo] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members || [];

  const [contextMenu, setContextMenu] = useState(null);

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [800]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  useEffect(() => {
    if (chatDetails.data?.chat?.background) {
      setChatBackground(chatDetails.data.chat.background);
    } else {
      setChatBackground(chatBgPattern);
    }
  }, [chatDetails.data?.chat?.background]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      if (data.background) {
        setChatBackground(data.background);
        const messageForAlert = {
          content: `${data.sender.name} changed the chat background`,
          sender: {
            _id: data.sender._id,
            name: data.sender.name,
          },
          chat: chatId,
          createdAt: new Date().toISOString(),
          isSystem: true,
        };
        setMessages((prev) => [...prev, messageForAlert]);
      } else {
        const messageForAlert = {
          content: data.message,
          sender: {
            _id: "djasdhajksdhasdsadasdas",
            name: "Admin",
          },
          chat: chatId,
          createdAt: new Date().toISOString(),
          isSystem: true,
        };
        setMessages((prev) => [...prev, messageForAlert]);
      }
    },
    [chatId]
  );

  const handleMessageDeleted = ({ messageId, chatId: deletedInChatId }) => {
    if (chatId !== deletedInChatId) return;
    
    // Remove message from both old and new messages
    if (oldMessages) {
      setOldMessages(prev => prev.filter(msg => msg._id !== messageId));
    }
    setMessages(prev => prev.filter(msg => msg._id !== messageId));
  };

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [MESSAGE_DELETE]: handleMessageDeleted,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = useMemo(() => {
    return [...(oldMessages || []), ...messages];
  }, [oldMessages, messages]);

  const handleEmojiClick = (emojiObject) => {
    const cursor = inputRef.current.selectionStart;
    const text = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);
    setMessage(text);
    setShowEmojiPicker(false);
  };

  const handleClickAway = () => {
    setShowEmojiPicker(false);
  };

  const handleMessageReply = (message) => {
    setReplyTo(message);
    inputRef.current?.focus();
  };

  const handleMessageForward = async (message) => {
    if (!chatId) return;
    
    socket.emit("MESSAGE_FORWARD", {
      messageId: message._id,
      toChatId: chatId, // Make sure to provide the target chat ID
      members
    });
  };

  const handleMessageDelete = (message) => {
    if (!message || !message._id) return;
    
    socket.emit(MESSAGE_DELETE, {
      messageId: message._id,
      chatId,
      members
    });
  };

  const handleMessageReact = (message, emoji) => {
    const updateMessageWithReaction = (msg) => {
      if (msg._id !== message._id) return msg;

      const existingReactionIndex = msg.reactions?.findIndex(
        r => r.user._id === user._id && r.emoji === emoji
      );

      const currentReactions = [...(msg.reactions || [])];

      if (existingReactionIndex > -1) {
        // Remove reaction
        currentReactions.splice(existingReactionIndex, 1);
      } else {
        // Add reaction
        currentReactions.push({
          user: {
            _id: user._id,
            name: user.name
          },
          emoji
        });
      }

      return { ...msg, reactions: currentReactions };
    };

    // Update only the specific message in both old and new messages
    if (oldMessages) {
      setOldMessages(oldMessages.map(msg => 
        msg._id === message._id ? updateMessageWithReaction(msg) : msg
      ));
    }

    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg._id === message._id ? updateMessageWithReaction(msg) : msg
      )
    );

    // Emit to server
    socket.emit("REACT_TO_MESSAGE", {
      messageId: message._id,
      chatId,
      emoji,
      members
    });
  };

  // Socket event listeners
  useEffect(() => {
    const handleMessageReaction = ({ messageId, reactions }) => {
      const updateMessageReactions = (msg) => {
        if (msg._id === messageId) {
          return { ...msg, reactions };
        }
        return msg;
      };

      // Update both old and new messages
      if (oldMessages) {
        setOldMessages(oldMessages.map(updateMessageReactions));
      }

      setMessages(prevMessages => prevMessages.map(updateMessageReactions));
    };

    socket.on("MESSAGE_REACTION", handleMessageReaction);

    return () => {
      socket.off("MESSAGE_REACTION");
    };
  }, [socket, oldMessages]);

  useEffect(() => {
    // Add search functionality to window object
    window.searchMessages = (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const searchTerm = query.toLowerCase();
      const results = allMessages.filter(msg => 
        msg.content?.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    };

    return () => {
      delete window.searchMessages;
    };
  }, [allMessages]);

  const handleVoiceMessage = async (audioBlob, audioUrl, duration) => {
    try {
      // Create a temporary message object for immediate display
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        content: null,
        audio: {
          url: audioUrl,
          duration: duration
        },
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
        isVoiceMessage: true
      };

      // Add the message to the local state immediately
      setMessages(prev => [...prev, tempMessage]);

      // Create FormData for the server
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.webm');
      formData.append('chatId', chatId);
      formData.append('members', JSON.stringify(members));
      formData.append('duration', duration);

      // Emit the voice message to the server
      socket.emit(NEW_MESSAGE, { 
        chatId, 
        members, 
        message: null,
        audio: formData,
        duration
      });
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  const handleContextMenu = (e, type, data) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      data
    });
  };

  const handlers = {
    reply: (message) => {
      handleMessageReply(message);
    },
    forward: (message) => {
      handleMessageForward(message);
    },
    edit: (message) => {
      // Add your edit logic
    },
    delete: (message) => {
      handleMessageDelete(message);
    },
    search: () => {
      // Add your search logic
    },
    settings: () => {
      // Add your settings logic
    },
  };


  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        position: 'relative'
      }}>
        <ChatHeader 
          chat={chatDetails?.data?.chat}
          user={user}
          onlineUsers={[]} // You'll need to pass online users from your socket state
          handleDeleteChat={() => {
            socket.emit("DELETE_CHAT", {
              chatId,
              members
            });
            navigate("/");
          }}
          openBackground={() => setIsBgDialogOpen(true)}
        />

        <Stack
          ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"0.7rem"}
          sx={{
            background: chatBackground?.type === "image" 
              ? `url(${chatBackground.value})` 
              : chatBackground?.value === "default" 
                ? chatBgPattern 
                : chatBackground?.value || chatBgPattern,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            height: "calc(100% - 60px)", // Adjust height to account for input area
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#E0E0E0',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              transition: 'all 0.2s ease'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#BDBDBD'
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, 'chat', chatDetails.data?.chat)}
        >
          {(isSearching ? searchResults : allMessages).map((message) => (
            <MessageComponent
              key={`${message._id}-${message.reactions?.length || 0}`}
              message={message}
              user={user}
              onReply={handleMessageReply}
              onForward={handleMessageForward}
              onDelete={handleMessageDelete}
              onReact={handleMessageReact}
              onContextMenu={(e) => {
                e.stopPropagation();
                handleContextMenu(e, 'message', message);
              }}
            />
          ))}

          {userTyping && <TypingLoader />}

          <div ref={bottomRef} />
        </Stack>

        <form
          style={{
            height: { xs: "60px", sm: "70px" },
            background: myblue,
            position: "relative",
            borderTop: "1px solid rgba(0,0,0,0.1)"
          }}
          onSubmit={submitHandler}
        >
          {showEmojiPicker && (
            <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: { xs: '4rem', sm: '5.6rem' },
                zIndex: 1000,
                width: { xs: '280px', sm: '300px' }
              }}>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width="100%"
                  height={400}
                  searchDisabled
                  skinTonesDisabled
                  previewConfig={{
                    showPreview: false
                  }}
                />
              </div>
            </ClickAwayListener>
          )}

          <Stack
            direction="row"
            height="100%"
            padding={{ xs: "0.5rem", sm: "0.7rem" }}
            alignItems="center"
            position="relative"
            spacing={1}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              px: 1
            }}>
              <IconButton
                sx={{
                  color: "white",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={handleFileOpen}
              >
                <AttachFileIcon sx={{ rotate: "30deg" }} />
              </IconButton>

              <IconButton
                sx={{
                  color: "white",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => setIsBgDialogOpen(true)}
              >
                <WallpaperIcon />
              </IconButton>

              <IconButton
                sx={{
                  color: showEmojiPicker ? orange : "white",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <EmojiIcon />
              </IconButton>

              <InputBox
                sx={{
                  flex: 1,
                  height: "100%",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: "400",
                  padding: { xs: "0.5rem", sm: "0.7rem" },
                  color: "white",
                  backgroundColor: "transparent",
                  '&::placeholder': {
                    color: "rgba(255,255,255,0.9)"
                  },
                  '&:focus': {
                    color: "black",
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease',
                    '&::placeholder': {
                      color: "rgba(0,0,0,0.5)"
                    }
                  }
                }}
                value={message}
                onChange={messageOnChange}
                placeholder="Type a message..."
                ref={inputRef}
              />

              <VoiceRecorder onRecordingComplete={handleVoiceMessage} />

              <IconButton
                type="submit"
                sx={{
                  color: "white",
                  backgroundColor: orange,
                  rotate: "-30deg",
                  padding: { xs: "0.4rem", sm: "0.5rem" },
                  ml: 1,
                  "&:hover": {
                    bgcolor: "error.dark",
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Stack>
        </form>
      </Box>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
      <ChatBackgroundDialog
        open={isBgDialogOpen}
        onClose={() => setIsBgDialogOpen(false)}
        chatId={chatId}
        members={members}
        user={user}
      />

      {/* {contextMenu && (
        <ChatContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          messageData={contextMenu.type === 'message' ? contextMenu.data : null}
          chatData={contextMenu.type === 'chat' ? contextMenu.data : null}
          onClose={() => setContextMenu(null)}
          onReply={handleMessageReply}
          onForward={handleMessageForward}
          onDelete={handleMessageDelete}
          onEdit={handlers.edit}
          onDownload={(message) => {
            // Add download logic
          }}
          onReport={(data) => {
            // Add report logic
          }}
          onBlock={(chat) => {
            // Add block logic
          }}
          onReact={handleMessageReact}
        />
      )} */}
    </Fragment>
  );
};

export default AppLayout()(Chat);
