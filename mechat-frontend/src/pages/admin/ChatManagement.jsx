import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack, useTheme, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

const ChatManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "table-header",
      width: 240,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "avatar",
      headerName: "Avatar",
      headerClassName: "table-header",
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 240,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "groupChat",
      headerName: "Group",
      headerClassName: "table-header",
      width: 140,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "totalMembers",
      headerName: "Members",
      headerClassName: "table-header",
      width: 140,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "members",
      headerName: "Avatars",
      headerClassName: "table-header",
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <AvatarCard max={isMobile ? 3 : 100} avatar={params.row.members} />
      ),
    },
    {
      field: "totalMessages",
      headerName: "Messages",
      headerClassName: "table-header",
      width: 160,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "creator",
      headerName: "Created By",
      headerClassName: "table-header",
      width: 160,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1}
          sx={{ 
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Avatar 
            alt={params.row.creator.name} 
            src={params.row.creator.avatar}
            sx={{ width: isMobile ? 24 : 32, height: isMobile ? 24 : 32 }}
          />
          <span>{params.row.creator.name}</span>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
