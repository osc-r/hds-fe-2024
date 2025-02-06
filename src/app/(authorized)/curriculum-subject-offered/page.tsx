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
import { Holiday } from "../../../services/calendar/calendar";
import ConfirmModal from "@/components/modals/confirm";
import { SubmitHandler } from "react-hook-form";
import subjectService from "../../../services/subject/subject.service";
import optionService from "../../../services/option/option.service";
import { Option } from "../../../services/option/option";
import SearchCurriculumSubjectOfferedForm, {
  SearchCurriculumSubjectOfferedFormType,
} from "@/components/forms/curriculum-subject-offered/SearchCurriculumSubjectOfferedForm";
import { SubjectOffered } from "../../../services/subject/subject";
import { useGetTermOptions } from "../../../services/calendar/calendar.hook";
import { GroupOption } from "../../../services/hdsv2-groups/hdsv2-groups";
import hdsv2GroupsService from "../../../services/hdsv2-groups/hdsv2-groups.service";

const columns = (
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
  onClickDelete: (id: string) => void
): TableColumnProps<SubjectOffered>[] => [
  {
    field: "",
    headerName: "ชั้นเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      const val = degreeOptions.find((i) => i.value === row.degreeLevel);
      return `${val?.label}-${row.grade}/${row.room}`;
    },
  },
  {
    field: "subject.code.th",
    headerName: "รหัสวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "subject.name.th",
    headerName: "ชื่อวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 160, wordBreak: "break-word" },
    },
  },
  {
    field: "subject.credit",
    headerName: "หน่วยกิต",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "subject.subjectType",
    headerName: "ประเภทวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 120, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectTypeOptions.find(
        (i) => i.value === row.subject.subjectType
      );
      return val?.label;
    },
  },
  {
    field: "subject.subjectAreas",
    headerName: "กลุ่มสาระการเรียนรู้",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 120, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectAreaOptions.find(
        (i) => i.value === row.subject.subjectAreas
      );
      return val?.label;
    },
  },
  {
    field: "subject.hours",
    headerName: "จำนวน\nชั่วโมง(เต็ม)",
    headerCellProps: {
      align: "center",
      style: { maxWidth: 80, wordBreak: "break-word" },
    },
    cellProps: {
      align: "center",
    },
  },
  {
    field: "studentEnrollments",
    headerName: "สถานะ",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return <Checkbox checked={row.studentEnrollments.length > 0} disabled />;
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
  const [queryKey, setQueryKey] = useState<
    SearchCurriculumSubjectOfferedFormType & {
      subject?: { code: string; name: string; subjectType: string };
    }
  >();

  const { isLoading, data, refetch } = useQuery<
    unknown,
    unknown,
    Holiday[],
    string[]
  >({
    queryKey: [
      "curriculum-subject-offered",
      queryKey?.academicTerm || "",
      queryKey?.degreeLevel || "",
      queryKey?.grade || "",
      queryKey?.room || "",
      queryKey?.subject?.code || "",
      queryKey?.subject?.name || "",
      queryKey?.subject?.subjectType || "",
    ],
    queryFn: ({ queryKey }) => {
      const [
        ,
        academicTerm,
        degreeLevel,
        grade,
        room,
        code,
        name,
        subjectType,
      ] = queryKey;
      return subjectService
        .getSubjectOffered({
          academicTerm: academicTerm || undefined,
          degreeLevel: degreeLevel || undefined,
          grade: grade || undefined,
          room: room || undefined,
          ["subject.code"]: code || undefined,
          ["subject.name"]: name || undefined,
          ["subject.subjectType"]: subjectType || undefined,
          // limit: 10,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
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
    initialData: {},
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
    initialData: {},
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
    initialData: {},
  });

  const { data: termOptions } = useGetTermOptions("th");

  const { data: classOptions } = useQuery<
    GroupOption[],
    unknown,
    {
      label: string;
      value: string;
      data: {
        degreeLevel: string;
        grade: string;
        room: string;
      };
    }[]
  >({
    queryKey: ["classOptions"],
    queryFn: (ctx) => {
      return hdsv2GroupsService
        .getGroupsOption("full")
        .then((res) => res.data.data.result);
    },
    select: (data) => {
      const LANG = "th";
      const output: {
        label: string;
        value: string;
        data: {
          degreeLevel: string;
          grade: string;
          room: string;
        };
      }[] = [];
      data.forEach((item) => {
        output.push({
          label: item[LANG],
          value: item.queryString,
          data: item.query,
        });
      });
      return output;
    },
    initialData: [],
  });

  const { mutate, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await subjectService.deleteOfferedById(id)).data;
    },
    onSuccess: () => {
      handleCloseConfirmModal();
      refetch();
    },
  });

  const [open, setOpen] = useState(false);

  const onClickDelete = (id: string) => {
    setOpen(true);
    selectedId.current = id;
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchCurriculumSubjectOfferedFormType> = (
    dto
  ) => {
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
            รายวิชาที่เปิดสอน
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/curriculum-subject-offered/create");
            }}
          >
            เพิ่มรายวิชาที่เปิดสอน
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
            <SearchCurriculumSubjectOfferedForm
              onSubmit={onSearch}
              academicTermOptions={termOptions || []}
              classOptions={classOptions || []}
            />
            <Grid size={12}>
              <Table
                columns={columns(
                  subjectAreaOptions,
                  subjectTypeOptions,
                  degreeOptions,
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
