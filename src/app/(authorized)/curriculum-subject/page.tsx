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
import ConfirmModal from "@/components/modals/confirm";
import { SubmitHandler } from "react-hook-form";
import SearchCurriculumSubjectForm, {
  SearchCurriculumSubjectFormType,
} from "@/components/forms/curriculum-subject/SearchCurriculumSubjectForm";
import { Option } from "../../../services/option/option";
import { Subject } from "../../../services/subject/subject";
import { useGetDegreeOptions } from "../../../services/option/option.hook";
import {
  useDeleteSubjectById,
  useGetCorCurriculumOptions,
  useGetSubjectAreaOptions,
  useGetSubjects,
  useGetSubjectTypeOptions,
} from "../../../services/subject/subject.hook";

const columns = (
  lang: string,
  subjectAreaOptions: {
    label: string;
    value: string;
  }[],
  subjectTypeOptions: {
    label: string;
    value: string;
  }[],

  degreeOptions: {
    label: string;
    value: string;
  }[],
  onClickEdit: (id: string) => void,
  onClickDelete: (id: string) => void
): TableColumnProps<Subject>[] => [
  {
    field: "codeSuffix",
    headerName: "รหัสวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: `name.${lang}`,
    headerName: "ชื่อวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "credit",
    headerName: "หน่วยกิต",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "degreeLevel",
    headerName: "ระดับการศึกษา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      const val = degreeOptions.find((i) => i.value === row.degreeLevel);
      return val?.label;
    },
  },
  {
    field: "subjectType",
    headerName: "ประเภทวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 160, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectTypeOptions.find((i) => i.value === row.subjectType);
      return val?.label;
    },
  },
  {
    field: "subjectAreas",
    headerName: "กลุ่มสาระการเรียนรู้",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 160, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectAreaOptions.find((i) => i.value === row.subjectAreas);
      return val?.label;
    },
  },
  {
    field: "hours",
    headerName: "จำนวนชั่วโมง(เต็ม)",
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
  const [queryKey, setQueryKey] = useState<SearchCurriculumSubjectFormType>({
    page: "1",
    offset: "0",
    limit: "10",
  });

  const { isLoading, data, refetch } = useGetSubjects(
    queryKey?.curriculum || "",
    queryKey?.code || "",
    queryKey?.name || "",
    queryKey?.subjectType || "",
    queryKey?.subjectAreas || "",
    queryKey?.degreeLevel || "",
    queryKey?.page,
    queryKey?.limit,
    queryKey?.offset
  );

  const { data: subjectAreaOptions } = useGetSubjectAreaOptions("th");

  const { data: subjectTypeOptions } = useGetSubjectTypeOptions("th");

  const { data: coreCurriculumOptions } = useGetCorCurriculumOptions("th");

  const { data: degreeOptions } = useGetDegreeOptions("th");

  const { mutate, isPending } = useDeleteSubjectById(() => {
    handleCloseConfirmModal();
    refetch();
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/curriculum-subject/${id}`);
  };

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchCurriculumSubjectFormType> = (dto) => {
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
            รายวิชาของโรงเรียนสามัญ
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/curriculum-subject/create");
            }}
          >
            เพิ่มรายวิชา
          </Button>
          <Button variant="outlined" color="info" sx={{ ml: 2 }} disabled>
            นำเข้าข้อมูล
          </Button>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <SearchCurriculumSubjectForm
              onSubmit={onSearch}
              curriculumOptions={coreCurriculumOptions || []}
              degreeLevelOptions={degreeOptions || []}
              subjectAreasOptions={subjectAreaOptions || []}
              subjectTypeOptions={subjectTypeOptions || []}
            />
            <Grid size={12}>
              <Table
                columns={columns(
                  "th",
                  subjectAreaOptions,
                  subjectTypeOptions,
                  degreeOptions,
                  onClickEdit,
                  onClickDelete
                )}
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
