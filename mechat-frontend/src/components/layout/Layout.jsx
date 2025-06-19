import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { theme } from "../../constants/theme";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <Stack
      direction="row"
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: theme.colors.primary.main,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: theme.colors.primary.light,
          transition: theme.components.transition,
        }}
      >
        <Outlet />
      </Box>
    </Stack>
  );
};

export default Layout; 