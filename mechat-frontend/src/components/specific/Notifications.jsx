import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  Divider,
  Box,
  Slide,
  useTheme,
  List,
  Fade,
  Badge,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const theme = useTheme();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog
      open={isNotification}
      onClose={closeHandler}
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
            badgeContent={data?.allRequests?.length || 0}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#5fb9a9',
                color: 'white'
              }
            }}
          >
            <NotificationsIcon sx={{ fontSize: 32, color: '#5fb9a9' }} />
          </Badge>
          <DialogTitle sx={{ fontSize: { xs: "1.2rem", sm: "1.6rem" }, p: 0 }}>
            Notifications
          </DialogTitle>
        </Stack>

        <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

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
              {[...Array(3)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  height={50}
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          ) : !data?.allRequests?.length ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px'
            }}>
              <Typography color="text.secondary">
                No new notifications
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
              {data.allRequests.map(({ sender, _id }) => (
                <Fade in key={_id}>
                  <Box 
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`, 
                      borderRadius: 3,
                      marginBottom: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#5fb9a9',
                        backgroundColor: 'rgba(95, 185, 169, 0.1)',
                      }
                    }}
                  >
                    <NotificationItem
                      sender={sender}
                      _id={_id}
                      handler={friendRequestHandler}
                    />
                  </Box>
                </Fade>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width="100%"
      >
        <Avatar 
          src={avatar} 
          alt={name} 
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
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 500,
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handler({ _id, accept: true })}
            sx={{
              backgroundColor: '#5fb9a9',
              '&:hover': {
                backgroundColor: '#4ea698',
              }
            }}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handler({ _id, accept: false })}
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': {
                borderColor: '#c62828',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
              }
            }}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
