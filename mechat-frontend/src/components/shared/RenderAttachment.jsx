import React from "react";
import { transformImage } from "../../lib/features";
import { InsertDriveFile as InsertDriveFileIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"300px"} controls />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          // width={"200px"}
          // height={"150px"}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
          }}
        />
      );

    case "audio":
      return (
        <audio 
          src={url} 
          preload="none" 
          controls 
          // style={{ width: "300px" }}
        />
      );

    default:
      return (
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#f0f0f0",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "200px",
          }}
        >
          <InsertDriveFileIcon />
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {url.split("/").pop()}
          </Typography>
        </Box>
      );
  }
};

export default RenderAttachment;
