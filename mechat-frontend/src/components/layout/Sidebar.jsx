import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Home, Chat, Settings } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "../../constants/theme";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home />, path: "/" },
    { icon: <Chat />, path: "/chat" },
    { icon: <Settings />, path: "/settings" },
  ];

  return (
    <Box
      sx={{
        width: { xs: "4rem", sm: "5rem" },
        height: "100%",
        bgcolor: theme.colors.primary.main,
        borderRight: `1px solid ${theme.colors.primary.light}`,
        transition: theme.components.transition,
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          py: 3,
          height: "100%",
        }}
      >
        {navItems.map((item) => (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: location.pathname === item.path ? theme.colors.secondary.main : theme.colors.text.secondary,
              "&:hover": {
                color: theme.colors.secondary.main,
                bgcolor: "rgba(0, 173, 181, 0.1)",
              },
              transition: theme.components.transition,
              borderRadius: theme.components.borderRadius,
            }}
          >
            {item.icon}
          </IconButton>
        ))}
      </Stack>
    </Box>
  );
};

export default Sidebar; 