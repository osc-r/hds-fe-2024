"use client";

import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import calendarService from "../../../services/calendar/calendar.service";
import { Term } from "../../../services/calendar/calendar";
import dayjs from "dayjs";
import ConfirmModal from "@/components/modals/confirm";

const columns = (
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<Term>[] => [
  {
    field: "academicYear",
    headerName: "Academic\nYear",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "term",
    headerName: "Semester",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "openingDate",
    headerName: "Semester start\ndate",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return dayjs(row.openingDate).format("DD MMM YY");
    },
  },
  {
    field: "endingDate",
    headerName: "Semester end\ndate",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return dayjs(row.endingDate).format("DD MMM YY");
    },
  },
  {
    field: "midtermStartDate",
    headerName: "Midterm exam date",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return dayjs(row.midtermStartDate).format("DD MMM YY");
    },
  },
  {
    field: "",
    headerName: "Final exam date",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "gradeSubmittingStartDate",
    headerName: "Date of submission\nof grades",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return (
        (row.gradeSubmittingStartDate &&
          dayjs(row.gradeSubmittingStartDate).format("DD MMM YY")) ||
        "-"
      );
    },
  },
  {
    field: "",
    headerName: "Number of\ncharacteristics\nindicators",
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
        <Box>
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

  const { isLoading, data, refetch } = useQuery<unknown, unknown, Term[]>({
    queryKey: ["academicCalendar"],
    queryFn: () =>
      calendarService.getTerms().then((res) => res.data.data.result),
  });

  const { mutate, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await calendarService.deleteTermById(id)).data;
    },
    onSuccess: () => {
      handleCloseConfirmModal();
      refetch();
    },
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/academic-calendar/${id}`);
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
    <Container sx={{ padding: 4, height: "100%" }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ปฏิทินการศึกษา
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ sm: 6, xs: 12 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  router.push("/academic-calendar/create");
                }}
              >
                เพิ่มปฎิทินการศึกษา
              </Button>
              <Button variant="outlined" color="info" sx={{ ml: 2 }} disabled>
                พิมพ์
              </Button>
            </Grid>
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
