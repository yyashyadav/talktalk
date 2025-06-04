import { Stack, Box } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack 
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden", // Prevent horizontal scroll
        paddingBottom: "2rem" // Add extra space at the bottom
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members = [] } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        // Calculate online members count for group chats
        const onlineMembersCount = members.filter(memberId => 
          onlineUsers.includes(memberId)
        ).length;

        // For individual chats, check if the other user is online
        const isOnline = groupChat 
          ? onlineMembersCount > 0
          : members.some(memberId => 
              onlineUsers.includes(memberId)
            );

        return (
          <Box 
            key={_id} 
            sx={{ 
              width: "100%",
              borderBottom: index !== chats.length  ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
              '&:last-child': {
                marginBottom: '2rem' // Add extra margin to the last chat item
              }
            }}
          >
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              groupChat={groupChat}
              onlineMembersCount={onlineMembersCount}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

export default ChatList;
