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
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ConfirmModal from "@/components/modals/confirm";
import { Building } from "../../../services/class-scheduler/class-scheduler";
import nonAcademicActivityService from "../../../services/non-academic-activity/non-academic-activity.service";
import SearchActivityForm, {
  SearchActivityFormType,
} from "@/components/forms/activity/SearchActivityForm";
import { TermOption } from "../../../services/calendar/calendar";
import calendarService from "../../../services/calendar/calendar.service";
import { SubmitHandler } from "react-hook-form";

const columns = (
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<Building>[] => [
  {
    field: "name.th",
    headerName: "ชื่อกิจกรรม",
    headerCellProps: { align: "center" },
    cellProps: { align: "left" },
  },
  {
    field: "",
    headerName: "Options",
    headerCellProps: {
      align: "center",
      sx: {
        width: 200,
      },
    },
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

  const [open, setOpen] = useState(false);
  const [queryKey, setQueryKey] = useState<SearchActivityFormType>();

  const { isLoading, data, refetch } = useQuery<
    unknown,
    unknown,
    Building[],
    string[]
  >({
    queryKey: ["activity", queryKey?.academicTerm || ""],
    queryFn: ({ queryKey }) => {
      const [, academicTerm] = queryKey;
      return nonAcademicActivityService
        .getNonAcademicActivities({ academicTerm: academicTerm || undefined })
        .then((res) => res.data.data.result);
    },
    initialData: [],
    enabled: false,
  });

  const { mutate, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (
        await nonAcademicActivityService.deleteNonAcademicActivityById(id)
      ).data;
    },
    onSuccess: () => {
      handleCloseConfirmModal();
      refetch();
    },
  });

  const { data: termOptions } = useQuery<
    TermOption,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["termOptions"],
    queryFn: () => {
      return calendarService.getTermOptions().then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
    initialData: {},
  });

  const onClickEdit = (id: string) => {
    router.push(`/activity/${id}`);
  };

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchActivityFormType> = (dto) => {
    setQueryKey(dto);
    setTimeout(refetch, 300);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Container sx={{ padding: 4, display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            โฮมรูมและกิจกรรมอื่นๆ
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/activity/create");
            }}
          >
            สร้างกิจกรรม
          </Button>
          <Button variant="outlined" color="info" sx={{ ml: 2 }} disabled>
            พิมพ์
          </Button>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <SearchActivityForm onSubmit={onSearch} termOptions={termOptions} />
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
