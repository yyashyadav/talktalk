import { useInputValidation } from "6pp";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Slide,
  useTheme,
  List,
  Fade,
  Badge,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import UserItem from "../shared/UserItem";
import { Group as GroupIcon } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const theme = useTheme();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useErrors([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((member) => member !== id) : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (selectedMembers.length < 2)
      return toast.error("Please select at least 3 members");
    if (!groupName.value.trim()) return toast.error("Group name is required");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  return (
    <Dialog
      onClose={closeHandler}
      open={isNewGroup}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          boxShadow: 6,
        },
      }}
    >
      <Box p={{ xs: 2, sm: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={2}>
          <Badge
            badgeContent={selectedMembers.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#5fb9a9',
                color: 'white'
              }
            }}
          >
            <GroupIcon sx={{ fontSize: 32, color: '#5fb9a9' }} />
          </Badge>
          <DialogTitle sx={{ fontSize: { xs: "1.2rem", sm: "1.6rem" }, p: 0 }}>
            Create a New Group
          </DialogTitle>
        </Stack>

        <TextField
          fullWidth
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          variant="outlined"
          size="medium"
          sx={{
            mt: 2,
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#5fb9a9',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#5fb9a9',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#5fb9a9',
            },
          }}
        />

        <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

        <Typography variant="subtitle1" sx={{ 
          fontWeight: 500, 
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          Select Members <Typography component="span" color="text.secondary" variant="body2">
            ({selectedMembers.length} selected)
          </Typography>
        </Typography>

        <Box
          maxHeight="250px"
          overflow="auto"
          borderRadius={2}
          border={`1px solid ${theme.palette.divider}`}
          px={1}
          py={1}
          sx={{
            background: theme.palette.background.default,
            transition: "all 0.3s",
          }}
        >
          {isLoading ? (
            <Stack spacing={1}>
              {[...Array(4)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  height={50}
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          ) : !data?.friends?.length ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px'
            }}>
              <Typography color="text.secondary">
                No friends available
              </Typography>
            </Box>
          ) : (
            <List
              sx={{
                '& .MuiListItem-root': {
                  '&:hover': {
                    borderColor: '#5fb9a9',
                    cursor: 'pointer',
                  }
                }
              }}
            >
              {data.friends.map((user) => (
                <Fade in key={user._id}>
                  <Box 
                    onClick={() => selectMemberHandler(user._id)}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`, 
                      borderRadius: 3,
                      marginBottom: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedMembers.includes(user._id) ? 'rgba(95, 185, 169, 0.2)' : 'transparent',
                      transform: selectedMembers.includes(user._id) ? 'scale(1)' : 'scale(1)',
                      '&:hover': {
                        borderColor: '#5fb9a9',
                        backgroundColor: selectedMembers.includes(user._id) ? 'rgba(95, 185, 169, 0.2)' : 'rgba(95, 185, 169, 0.1)',
                        transform: 'scale(1)',
                      }
                    }}
                  >
                    <UserItem
                      user={user}
                      handler={selectMemberHandler}
                      isAdded={selectedMembers.includes(user._id)}
                      disableHandlerClick={true}
                    />
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button 
            onClick={closeHandler} 
            variant="outlined"
            sx={{
              borderColor: '#5fb9a9',
              color: '#5fb9a9',
              '&:hover': {
                borderColor: '#4ea698',
                backgroundColor: 'rgba(95, 185, 169, 0.1)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitHandler}
            variant="contained"
            disabled={isLoadingNewGroup || selectedMembers.length < 2}
            sx={{
              backgroundColor: '#5fb9a9',
              '&:hover': {
                backgroundColor: '#4ea698',
              },
              '&:disabled': {
                backgroundColor: 'rgba(95, 185, 169, 0.5)',
              }
            }}
          >
            {isLoadingNewGroup ? "Creating..." : "Create Group"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default NewGroup;
