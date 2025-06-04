import { PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography, Tooltip } from "@mui/material";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem
      sx={{
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar 
          src={transformImage(avatar)}
          sx={{
            width: 45,
            height: 45,
            border: "1px solid #5fb9a9",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
            }
          }}
        />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden", 
            textOverflow: "ellipsis",
            width: "100%",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          {name}
        </Typography>

        <Tooltip title={isAdded ? "Remove Friend" : "Add Friend"}>
          <IconButton
            size="medium"
            sx={{
              bgcolor: isAdded ? "rgba(211, 47, 47, 0.1)" : "rgba(95, 185, 169, 0.1)",
              color: isAdded ? "#d32f2f" : "#5fb9a9",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isAdded ? "rgba(211, 47, 47, 0.2)" : "rgba(95, 185, 169, 0.2)",
                transform: "scale(1.1)",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
              }
            }}
            onClick={() => handler(_id)}
            disabled={handlerIsLoading}
          >
            {isAdded ? <PersonRemoveIcon /> : <PersonAddIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
