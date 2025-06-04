import { useFetchData } from "6pp";
import { Avatar, Box, Stack, Skeleton, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";

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
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box key={`${params.row.id}-attachment-${index}`}>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 160,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 160,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
    align: 'center',
    headerAlign: 'center',
  },
];

const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.messages) {
      try {
        setRows(
          data.messages.map((i) => ({
            ...i,
            id: i._id,
            sender: {
              name: i.sender?.name || 'Unknown',
              avatar: i.sender?.avatar?.url || '',
            },
            createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
          }))
        );
      } catch (err) {
        console.error("Error processing messages:", err);
      }
    }
  }, [data]);

  if (error) {
    return (
      <AdminLayout>
        <Box p={3}>
          <Typography color="error">
            Error loading messages: {error.message || "Something went wrong"}
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {loading ? (
        <Box p={3}>
          <Skeleton variant="rectangular" height="100vh" />
        </Box>
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
