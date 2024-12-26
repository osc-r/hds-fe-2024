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
import { Holiday } from "../../../services/calendar/calendar";
import ConfirmModal from "@/components/modals/confirm";
import { SubmitHandler } from "react-hook-form";
import subjectService from "../../../services/subject/subject.service";
import SearchCurriculumSubjectForm, {
  SearchCurriculumSubjectFormType,
} from "@/components/forms/curriculum-subject/SearchCurriculumSubjectForm";
import optionService from "../../../services/option/option.service";
import { Option } from "../../../services/option/option";
import { Subject } from "../../../services/subject/subject";

const columns = (
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
    field: "name.th",
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
  },
  {
    field: "subjectType",
    headerName: "ประเภทวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 160, wordBreak: "break-word" },
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
  const [queryKey, setQueryKey] = useState<SearchCurriculumSubjectFormType>();

  const { isLoading, data, refetch } = useQuery<
    unknown,
    unknown,
    Holiday[],
    string[]
  >({
    queryKey: [
      "curriculum-subject",
      queryKey?.curriculum || "",
      queryKey?.code || "",
      queryKey?.name || "",
      queryKey?.subjectType || "",
      queryKey?.subjectAreas || "",
      queryKey?.degreeLevel || "",
    ],
    queryFn: ({ queryKey }) => {
      const [, curriculum, code, name, subjectType, subjectAreas, degreeLevel] =
        queryKey;
      return subjectService
        .getSubjects({
          curriculum: curriculum || undefined,
          code: code || undefined,
          name: name || undefined,
          subjectType: subjectType || undefined,
          subjectAreas: subjectAreas || undefined,
          degreeLevel: degreeLevel || undefined,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
  });

  const { data: subjectAreaOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["subjectAreaOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectAreaOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
  });

  const { data: subjectTypeOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["subjectTypeOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectTypeOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
  });

  const { data: coreCurriculumOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["coreCurriculumOptions"],
    queryFn: () => {
      return subjectService
        .getCoreCurriculumOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
  });

  const { data: degreeOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["degreeOptions"],
    queryFn: () => {
      return optionService.getDegreeOptions().then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
  });

  const { mutate, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await subjectService.deleteSubjectById(id)).data;
    },
    onSuccess: () => {
      handleCloseConfirmModal();
      refetch();
    },
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
    <Container sx={{ padding: 4, height: "100%" }}>
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
