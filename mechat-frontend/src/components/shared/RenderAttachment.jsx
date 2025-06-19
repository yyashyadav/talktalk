import React from "react";
import { transformImage, fileFormat } from "../../lib/features";
import { InsertDriveFile as InsertDriveFileIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const RenderAttachment = ({ attachment, isMe }) => {
  if (!attachment) return null;
  // Support both string and object
  let url = attachment.url || attachment;
  const file = fileFormat(url);

  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"300px"} controls style={{ borderRadius: 8, background: isMe ? "#222" : "#111" }} />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            borderRadius: 8,
            background: isMe ? "#222" : "#111"
          }}
        />
      );

    case "audio":
      return (
        <audio 
          src={url} 
          preload="none" 
          controls 
          style={{ width: "100%" }}
        />
      );

    default:
      return (
        <Box
          sx={{
            display: "flex",
            backgroundColor: isMe ? "#2a4a5a" : "#1e2a35",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #3a6073",
            borderRadius: "8px",
            width: "200px",
          }}
        >
          <InsertDriveFileIcon sx={{ color: "#f0f4f8" }} />
          <Typography variant="body2" sx={{ wordBreak: "break-all", color: "#f0f4f8" }}>
            {typeof url === "string" && url.split ? url.split("/").pop() : "File"}
          </Typography>
        </Box>
      );
  }
};

export default RenderAttachment;
