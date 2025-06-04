import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { matBlack, myblue, mybluerev } from "../../constants/color";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      sx={{
        height: "100vh",
        p: 0,
        maxWidth: "100% !important"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: isMobile ? "0.5rem" : "1rem 2rem",
          borderRadius: "0.5rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
        }}
      >
        <Typography
          textAlign={"center"}
          variant={isMobile ? "h6" : "h4"}
          sx={{
            margin: isMobile ? "1rem" : "1.5rem",
            textTransform: "uppercase",
            fontSize: isMobile ? "1rem" : "2rem",
          }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
            
          }}
          sx={{
            border: "none",
            ".table-header": {
              // bgcolor: matBlack,
              background: myblue,
              color: "white",
            },
            "& .MuiDataGrid-columnHeaders": {
              minHeight: "45px !important",
              maxHeight: "45px !important",
            }
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
