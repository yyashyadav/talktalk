import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Grid,
  useTheme,
  useMediaQuery
} from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { matBlack, myblue } from "../../constants/color";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

// Dashboard Skeleton Component
const DashboardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Appbar Skeleton */}
      <Paper
        elevation={3}
        sx={{ 
          padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
          margin: { xs: "1rem 0", sm: "1.5rem 0", md: "2rem 0" },
          borderRadius: "1rem"
        }}
      >
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={"1rem"}>
          <Skeleton 
            variant="text" 
            width={isMobile ? 150 : 200} 
            height={isMobile ? 30 : 40} 
            sx={{ 
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
                md: "2rem", 
                lg: "2.125rem"
              }
            }} 
          />
        </Stack>
        <Skeleton 
          variant="text" 
          width={isMobile ? 200 : 300} 
          height={isMobile ? 20 : 30} 
          sx={{ 
            mt: 1,
            fontSize: {
              xs: "0.75rem",
              sm: "0.9rem",
              md: "1.1rem",
              lg: "1.25rem" 
            }
          }} 
        />
      </Paper>

      {/* Charts Skeleton */}
      <Stack
        direction={{
          xs: "column",
          lg: "row",
        }}
        flexWrap={"wrap"}
        justifyContent={"center"}
        alignItems={{
          xs: "center",
          lg: "stretch",
        }}
        sx={{ gap: { xs: "1rem", sm: "1.5rem", md: "2rem" } }}
      >
        {/* Line Chart Skeleton */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "1rem", sm: "1.5rem", md: "2rem 3.5rem" },
            borderRadius: "1rem",
            width: "100%",
            maxWidth: { xs: "100%", lg: "45rem" },
          }}
        >
          <Skeleton 
            variant="text" 
            width={isMobile ? 150 : 200} 
            height={isMobile ? 30 : 40} 
            sx={{ mb: { xs: 2, sm: 3, md: 4 } }} 
          />
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={isMobile ? 200 : 300} 
            sx={{ borderRadius: 2 }} 
          />
        </Paper>

        {/* Doughnut Chart Skeleton */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: "0.5rem", sm: "1rem" },
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: { xs: "100%", sm: "50%" },
            position: "relative",
            maxWidth: { xs: "100%", sm: "25rem" },
            height: { xs: 250, sm: 300 },
          }}
        >
          <Skeleton 
            variant="circular" 
            width={isMobile ? 150 : 200} 
            height={isMobile ? 150 : 200} 
          />
          <Stack
            position={"absolute"}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"0.5rem"}
            width={"100%"}
            height={"100%"}
          >
            <Skeleton variant="circular" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
            <Skeleton variant="text" width={isMobile ? 20 : 30} height={isMobile ? 20 : 24} />
            <Skeleton variant="circular" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
          </Stack>
        </Paper>
      </Stack>

      {/* Widgets Skeleton */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
        justifyContent={{ xs: "center", sm: "space-between" }}
        alignItems={"center"}
        margin={{ xs: "1rem 0", sm: "1.5rem 0", md: "2rem 0" }}
      >
        {[1, 2, 3].map((item) => (
          <Paper
            key={item}
            elevation={3}
            sx={{
              padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
              margin: { xs: "0.5rem 0", sm: "1rem 0", md: "2rem 0" },
              borderRadius: "1.5rem",
              width: { xs: "100%", sm: "18rem", md: "20rem" },
            }}
          >
            <Stack alignItems={"center"} spacing={"1rem"}>
              <Skeleton 
                variant="circular" 
                width={isMobile ? 60 : 80} 
                height={isMobile ? 60 : 80} 
                sx={{ 
                  border: "5px solid rgba(0,0,0,0.1)",
                  borderRadius: "50%"
                }} 
              />
              <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <Skeleton variant="circular" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} />
                <Skeleton variant="text" width={isMobile ? 80 : 100} height={isMobile ? 20 : 24} />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ 
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        marginBottom: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        borderRadius: "1rem",
        background: myblue,
      }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={"1rem"}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold", 
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
              md: "2rem", 
              lg: "2.125rem"
            }
          }}
        >
          TalkTalk Admin Panel
        </Typography>
      </Stack>
      <Typography 
        variant="h6" 
        sx={{ 
          // color: "rgba(0,0,0,0.7)",
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: {
            xs: "0.75rem",
            sm: "0.9rem",
            md: "1.1rem",
            lg: "1.25rem" 
          }
        }} 
      >
        {moment().format("dddd, D MMMM YYYY")}
      </Typography>     
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
      justifyContent={{ xs: "center", sm: "space-between" }}
      alignItems={"center"}
      margin={{ xs: "1rem 0", sm: "1.5rem 0", md: "2rem 0" }}
    >
      <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon={<GroupIcon />}
      />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        Icon={<MessageIcon />}
      />
    </Stack>
  );

  return (
    <AdminLayout>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {Appbar}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              md: "stretch",
            }}
            sx={{ gap: { xs: "1rem", sm: "1.5rem", md: "2rem" } }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: { xs: "1rem", sm: "1.5rem", md: "2rem 3.5rem" },
                borderRadius: "1rem",
                width: "100%",
                maxWidth: { xs: "100%", md: "60%" },
              }}
            >
              <Typography 
                margin={{ xs: "1rem 0", sm: "1.5rem 0", md: "2rem 0" }} 
                variant="h4"
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                    md: "2rem"
                  }
                }}
              >
                Last Messages
              </Typography>

              <LineChart value={stats?.messagesChart || []} />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: { xs: "0.5rem", sm: "1rem" },
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", md: "35%" },
                position: "relative",
                maxWidth: { xs: "100%", sm: "25rem" },
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />

              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} /> 
                <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Vs </Typography>
                <PersonIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              </Stack>
            </Paper>
          </Stack>

          {Widgets}
        </Box>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        margin: { xs: "0.5rem 0", sm: "1rem 0", md: "2rem 0" },
        borderRadius: "1.5rem",
        width: { xs: "100%", sm: "18rem", md: "20rem" },
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: `5px solid ${matBlack}`,
            width: { xs: "4rem", sm: "5rem" },
            height: { xs: "4rem", sm: "5rem" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: { xs: "1.25rem", sm: "1.5rem" }
          }}
        >
          {value}
        </Typography>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          {Icon}
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            {title}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Dashboard;
