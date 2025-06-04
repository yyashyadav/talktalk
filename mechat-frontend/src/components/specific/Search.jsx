import { useInputValidation } from "6pp";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Divider,
  Box,
  Skeleton,
  Fade,
  Slide,
  useTheme,
  Typography,
  IconButton,
  Badge
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const addFriendHandler = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setLoading(true);
      searchUser(search.value)
        .then(({ data }) => {
          setLoading(false);
          if (!data?.users?.length) {
            setUsers([]);
          } else {
            setUsers(data.users);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setUsers([]);
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
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
            badgeContent={users.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#5fb9a9',
                color: 'white'
              }
            }}
          >
            <SearchIcon sx={{ fontSize: 32, color: '#5fb9a9' }} />
          </Badge>
          <DialogTitle sx={{ fontSize: { xs: "1.2rem", sm: "1.6rem" }, p: 0 }}>
            Find People
          </DialogTitle>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search Users"
          value={search.value}
          onChange={search.changeHandler}
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ 
                  color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#5fb9a9',
                    cursor: 'default',
                  },
                  '.MuiInputBase-root.Mui-focused &': {
                    color: '#5fb9a9'
                  }
                }} />
              </InputAdornment>
            ),
            endAdornment: search.value && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => search.changeHandler({ target: { value: '' } })}
                  sx={{ 
                    color: 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#5fb9a9',
                      backgroundColor: 'rgba(95, 185, 169, 0.1)',
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

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
          {loading ? (
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
          ) : users.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px'
            }}>
              <Typography color="text.secondary">
                No new user available
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
              {users.map((user) => (
                <Fade in key={user._id}>
                  <Box 
                    onClick={(e) => addFriendHandler(user._id, e)}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`, 
                      borderRadius: 3,
                      marginBottom: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        borderColor: '#5fb9a9',
                        backgroundColor: 'rgba(95, 185, 169, 0.1)',
                      }
                    }}
                  >
                    <UserItem
                      user={user}
                      handler={(e) => addFriendHandler(user._id, e)}
                      handlerIsLoading={isLoadingSendFriendRequest}
                      disableHandlerClick={true}
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

export default Search;
