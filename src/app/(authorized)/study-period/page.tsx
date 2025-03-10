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
import ConfirmModal from "@/components/modals/confirm";
import { SubmitHandler } from "react-hook-form";
import { useGetTermOptions } from "../../../services/calendar/calendar.hook";
import {
  useDeleteScheduleConfigById,
  useGetScheduleConfig,
} from "../../../services/class-scheduler/class-scheduler.hook";
import { SearchNonAcademicActivityDto } from "../../../services/non-academic-activity/non-academic-activity";
import SearchStudyPeriodForm from "@/components/forms/study-period/SearchStudyPeriodForm";
import { StudyPeriod } from "../../../services/class-scheduler/class-scheduler";

const columns = (
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<StudyPeriod>[] => [
  {
    field: "name",
    headerName: "ชื่อ",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "isStudyOnWeekend",
    headerName: "เรียนเสาร์-อาทิตย์",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return <Checkbox checked={row.isStudyOnWeekend} disabled />;
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
  const [queryKey, setQueryKey] = useState<{ academicTerm: string }>({
    academicTerm: "",
  });

  const { data: termOptions } = useGetTermOptions("th");

  const { isLoading, data, refetch } = useGetScheduleConfig(
    queryKey?.academicTerm
  );

  const { mutate, isPending } = useDeleteScheduleConfigById(() => {
    handleCloseConfirmModal();
    refetch();
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/study-period/${id}`);
  };

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchNonAcademicActivityDto> = (dto) => {
    setQueryKey({ academicTerm: dto.academicTerm || "" });
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
            คาบเรียน
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/study-period/create");
            }}
          >
            เพิ่มคาบเรียน
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
            <SearchStudyPeriodForm
              onSubmit={onSearch}
              termOptions={termOptions}
            />
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
