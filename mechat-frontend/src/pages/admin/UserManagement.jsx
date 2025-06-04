import { useFetchData } from "6pp";
import { Avatar, Skeleton, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, useMediaQuery } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import axios from "axios";
import toast from "react-hot-toast";

const UserManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        }))
      );
    }
  }, [data]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { data } = await axios.delete(
        `${server}/api/v1/admin/users/${selectedUser.id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      // Update the rows state to remove the deleted user
      setRows(rows.filter(row => row.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "table-header",
      width:240,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "avatar",
      headerName: "Avatar",
      headerClassName: "table-header",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.avatar} />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "username",
      headerName: "Username",
      headerClassName: "table-header",
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "friends",
      headerName: "Friends",
      headerClassName: "table-header",
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "groups",
      headerName: "Groups",
      headerClassName: "table-header",
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "table-header",
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row)}
          sx={{ 
            p: isMobile ? 0.5 : 1,
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      ),
    },
  ];

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <>
          <Table heading={"All Users"} columns={columns} rows={rows} />
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete user <b>{selectedUser?.name}</b>? 
              <br />
              <br />
             <div style={{color: "red", fontSize: "14px"}}>This action cannot be undone!</div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
