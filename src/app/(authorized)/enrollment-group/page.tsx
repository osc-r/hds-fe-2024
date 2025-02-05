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
import { useRouter, useSearchParams } from "next/navigation";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import SearchEnrollmentGroupForm from "@/components/forms/enrollment-group/SearchEnrollmentGroupForm";
import { GroupOption } from "../../../services/hdsv2-groups/hdsv2-groups";
import hdsv2GroupsService from "../../../services/hdsv2-groups/hdsv2-groups.service";
import subjectService from "../../../services/subject/subject.service";
import {
  EnrollmentByGroup,
  SearchEnrollmentByGroupDto,
} from "../../../services/subject/subject";
import { useGetTermOptions } from "../../../services/calendar/calendar.hook";

const columns = (
  onClickEdit: (degreeLevel?: string, grade?: string, room?: string) => void
): TableColumnProps<EnrollmentByGroup>[] => [
  {
    field: "studentGroup.name.th",
    headerName: "ชั้นเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "program",
    headerName: "หลักสูตร",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "รายวิชาที่เปิดสอน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "isOpenForEnrollment",
    headerName: "สถานะการลงทะเบียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return <Checkbox checked={!row.isOpenForEnrollment} disabled />;
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
              onClickEdit(
                row.studentGroup.degreeLevel,
                row.studentGroup.grade as unknown as string,
                row.studentGroup.room as unknown as string
              );
            }}
            variant="outlined"
            sx={{ marginRight: 1 }}
            disabled={!row.isOpenForEnrollment}
          >
            ลงทะเบียนเรียนตามชั้นเรียน
          </Button>
        </Box>
      );
    },
  },
];

export default function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const academicTerm = searchParams.get("academicTerm") || "";
  const grade = searchParams.get("grade") || undefined;

  const [queryKey, setQueryKey] = useState<SearchEnrollmentByGroupDto>();

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
    queryFn: () => {
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

  const { isLoading, data, refetch } = useQuery<
    unknown,
    unknown,
    EnrollmentByGroup[],
    string[]
  >({
    queryKey: [
      "enrollment-by-group",
      queryKey?.academicTerm || "",
      queryKey?.degreeLevel || "",
      queryKey?.grade || "",
      queryKey?.room || "",
    ],
    queryFn: ({ queryKey }) => {
      const [, academicTerm, degreeLevel, grade, room] = queryKey;
      return subjectService
        .getEnrollmentByGroup({
          academicTerm,
          degreeLevel: degreeLevel || undefined,
          grade: grade || undefined,
          room: room || undefined,
        })
        .then((res) => res.data.data);
    },
    enabled: false,
  });

  const onClickEdit = (degreeLevel?: string, grade?: string, room?: string) => {
    const query = {
      academicTerm: queryKey?.academicTerm || "",
      degreeLevel: degreeLevel || "",
      grade: grade || "",
      room: room || "",
    };
    const generateQuery = new URLSearchParams(query).toString();
    router.push(`/enrollment-group/enroll?${generateQuery}`);
  };

  const onSearch: SubmitHandler<SearchEnrollmentByGroupDto> = (dto) => {
    const selectedClass = classOptions.find(
      (i) => i.value === (dto.grade as unknown as string)
    );

    setQueryKey({
      ...dto,
      degreeLevel: selectedClass?.data?.degreeLevel,
      grade: selectedClass?.data?.grade,
      room: selectedClass?.data?.room,
    });

    const generateQuery = new URLSearchParams(dto).toString();
    router.replace(`/enrollment-group?${generateQuery}`);

    setTimeout(refetch, 300);
  };

  useEffect(() => {
    if (academicTerm) {
      onSearch({ academicTerm, grade });
    }
  }, []);

  return (
    <Container sx={{ padding: 4, display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ลงทะเบียนเรียนตามชั้นเรียน
          </Typography>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <SearchEnrollmentGroupForm
              classOptions={classOptions}
              termOptions={termOptions}
              onSubmit={onSearch}
              initialData={{
                academicTerm,
                grade: grade === "undefined" ? "" : grade,
              }}
            />
            <Grid size={12}>
              <Table
                columns={columns(onClickEdit)}
                data={data || []}
                onSizeChange={() => {}}
                pagination={{
                  total: 10,
                  onPageChange: () => {},
                  currentPage: 1,
                }}
                showNumber
                loading={isLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
