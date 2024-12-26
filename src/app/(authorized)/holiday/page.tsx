"use client";

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import calendarService from "../../../services/calendar/calendar.service";
import { Holiday } from "../../../services/calendar/calendar";
import dayjs from "dayjs";
import ConfirmModal from "@/components/modals/confirm";
import SearchHolidayForm, {
  SearchHolidayFormType,
} from "@/components/forms/holiday/SearchHolidayForm";
import { SubmitHandler } from "react-hook-form";

const columns = (
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<Holiday>[] => [
  {
    field: "date",
    headerName: "วันที่",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return dayjs(row.date).format("DD MMM YY");
    },
  },
  {
    field: "name.th",
    headerName: "ชื่อวันหยุด (ไทย)",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "name.en",
    headerName: "ชื่อวันหยุด (อังกฤษ)",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "havingOnlineClass",
    headerName: "เรียนออนไลน์",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return <Checkbox checked={row.havingOnlineClass} disabled />;
    },
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
  const [queryKey, setQueryKey] = useState<SearchHolidayFormType>();

  const { isLoading, data, refetch } = useQuery<
    unknown,
    unknown,
    Holiday[],
    string[]
  >({
    queryKey: ["holiday", queryKey?.academicYear || "", queryKey?.month || ""],
    queryFn: ({ queryKey }) => {
      const [, academicYear, month] = queryKey;
      return calendarService
        .getHolidays({
          academicYear: academicYear || undefined,
          month: month || undefined,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
  });

  const { mutate, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await calendarService.deleteHolidayById(id)).data;
    },
    onSuccess: () => {
      handleCloseConfirmModal();
      refetch();
    },
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/holiday/${id}`);
  };

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchHolidayFormType> = (dto) => {
    setQueryKey(dto);
    setTimeout(refetch, 300);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Container sx={{ padding: 4, height: "100%" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ข้อมูลวันหยุด
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/holiday/create");
            }}
          >
            เพิ่มข้อมูลวันหยุด
          </Button>
          <Button variant="outlined" color="info" sx={{ ml: 2 }}>
            พิมพ์
          </Button>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <SearchHolidayForm onSubmit={onSearch} />
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
