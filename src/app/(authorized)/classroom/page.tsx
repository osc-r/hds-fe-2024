"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useRef, useState } from "react";
import ConfirmModal from "@/components/modals/confirm";
import { Building } from "../../../services/class-scheduler/class-scheduler";
import {
  useDeleteRoomById,
  useGetRooms,
} from "../../../services/class-scheduler/class-scheduler.hook";

const columns = (
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<Building>[] => [
  {
    field: "building.name",
    headerName: "Classroom building",
    headerCellProps: { align: "center" },
    cellProps: { align: "left" },
  },
  {
    field: "name",
    headerName: "Classroom name",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "roomType",
    headerName: "Type of classroom",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "floorNo",
    headerName: "Floor No.",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "studyCapacity",
    headerName: "Number of study seats",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "examCapacity",
    headerName: "Number of examination seats",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "",
    headerName: "Options",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return (
        <Box sx={{ width: 150 }}>
          <Button
            size="small"
            onClick={() => {
              onClickEdit(row._id);
            }}
            variant="outlined"
            sx={{ marginRight: 1 }}
          >
            แก้ไข
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              onClickDelete(row._id);
            }}
          >
            ลบ
          </Button>
        </Box>
      );
    },
  },
];

export default function ListPage() {
  const router = useRouter();
  const selectedId = useRef("");

  const { isLoading, data, refetch } = useGetRooms();

  const { mutate, isPending } = useDeleteRoomById(() => {
    handleCloseConfirmModal();
    refetch();
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/classroom/${id}`);
  };

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  return (
    <Container sx={{ padding: 4, display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ข้อมูลห้องเรียน
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/classroom/create");
            }}
          >
            เพิ่มข้อมูลอาคารเรียน
          </Button>
          <Button variant="outlined" color="info" sx={{ ml: 2 }} disabled>
            พิมพ์
          </Button>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Table
                columns={columns(onClickEdit, onClickDelete)}
                data={data || []}
                onSizeChange={() => {}}
                pagination={{
                  total: 10,
                  onPageChange: () => {},
                  currentPage: 1,
                }}
                showNumber
                loading={isLoading || isPending}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmModal
        open={open}
        onClose={handleCloseConfirmModal}
        onConfirm={onConfirmDelete}
      />
    </Container>
  );
}
