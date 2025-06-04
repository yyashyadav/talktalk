import { Grid, Skeleton, Stack, Box, Avatar, Typography } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";
import { myblue, lightBlue, orange } from "../../constants/color";

// Chat List Item Skeleton
const ChatItemSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Skeleton variant="circular" width={50} height={50} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    </Box>
  );
};

// Message Skeleton
const MessageSkeleton = ({ isOwn = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: isOwn ? "row-reverse" : "row",
          gap: 1,
        }}
      >
        {!isOwn && <Skeleton variant="circular" width={30} height={30} />}
        <Box>
          <Skeleton
            variant="rounded"
            width={isOwn ? 200 : 180}
            height={60}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.5 }} />
        </Box>
        {isOwn && <Skeleton variant="circular" width={30} height={30} />}
      </Box>
    </Box>
  );
};

// Chat Header Skeleton
const ChatHeaderSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
      <Skeleton variant="circular" width={36} height={36} />
      <Skeleton variant="circular" width={36} height={36} />
    </Box>
  );
};

// Input Area Skeleton
const InputAreaSkeleton = () => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Skeleton variant="circular" width={36} height={36} />
      <Skeleton variant="circular" width={36} height={36} />
      <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 20 }} />
      <Skeleton variant="circular" width={36} height={36} />
    </Box>
  );
};

// Profile Sidebar Skeleton
const ProfileSidebarSkeleton = () => {
  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          height: "200px",
          background: "linear-gradient(-45deg, #5fb9a9,rgb(92, 157, 203))",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Skeleton variant="circular" width={200} height={200} />
        </Box>
      </Box>

      <Box sx={{ mt: 8, px: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="100%" height={60} sx={{ mt: 2, mb: 3 }} />

        <Box sx={{ mt: 2 }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="70%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const LayoutLoader = () => {
  return (
    <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
      {/* Left Sidebar - Chat List */}
      <Grid
        item
        sm={4}
        sx={{
          display: { xs: "none", sm: "block" },
          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
        }}
        height={"100%"}
      >
        <Box sx={{ p: 1 }}>
          <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
          {Array.from({ length: 8 }).map((_, index) => (
            <ChatItemSkeleton key={index} />
          ))}
        </Box>
      </Grid>

      {/* Middle - Chat Area */}
      <Grid
        item
        xs={12}
        sm={8}
        height={"100%"}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <ChatHeaderSkeleton />
          
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <MessageSkeleton key={`other-${index}`} isOwn={false} />
            ))}
            {Array.from({ length: 4 }).map((_, index) => (
              <MessageSkeleton key={`own-${index}`} isOwn={true} />
            ))}
          </Box>
          
          <InputAreaSkeleton />
        </Box>
      </Grid>
    </Grid>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0rem"}
      justifyContent={"left"}
    >
      <BouncingSkeleton
        variant="circular"
        width={10}
        height={10}
        sx={{
          bgcolor: lightBlue,
          background: myblue
        }}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={10}
        height={10}
        sx={{
          bgcolor: lightBlue,
          background: myblue
        }}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={10}
        height={10}
        sx={{
          bgcolor: lightBlue,
          background: myblue
        }}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={10}
        height={10}
        sx={{
          bgcolor: lightBlue,
          background: myblue
        }}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};

// Export all components
export {
  ChatItemSkeleton,
  MessageSkeleton,
  ChatHeaderSkeleton,
  InputAreaSkeleton,
  ProfileSidebarSkeleton,
  LayoutLoader,
  TypingLoader
};
