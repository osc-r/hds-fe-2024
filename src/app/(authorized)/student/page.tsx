"use client";

import { Container, Divider, Grid2 as Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useState } from "react";
import { SearchEnrollmentByGroupDto } from "../../../services/subject/subject";
import {
  useGetStudentGroupByTermId,
  useGetStudentGroupOptions,
  useGetTermOptions,
} from "../../../services/calendar/calendar.hook";
import { Suspense } from "react";
import SearchStudentForm from "@/components/forms/student/SearchStudentForm";
import { SubmitHandler } from "react-hook-form";
import { Student } from "../../../services/calendar/calendar";

const columns: TableColumnProps<Student & { class: string }>[] = [
  {
    field: "code",
    headerName: "เลขประจำตัว\nนักเรียน",
    headerCellProps: {
      align: "center",
      sx: { width: 96 },
    },
    cellProps: { align: "center", sx: { width: 96 } },
  },
  {
    field: "firstName.th",
    headerName: "ชื่อ-นามสกุล",
    headerCellProps: { align: "center" },
    cellProps: { align: "left" },
    render: (row) => {
      return (
        <Typography>
          {row.firstName.th} {row.lastName.th}
        </Typography>
      );
    },
  },
  {
    field: "class",
    headerName: "ชั้นเรียน",
    headerCellProps: {
      align: "center",
      sx: { width: 96 },
    },
    cellProps: { align: "center", sx: { width: 96 } },
  },
];

function ListPageComp() {
  const router = useRouter();

  const [queryKey, setQueryKey] = useState<SearchEnrollmentByGroupDto>();

  const { data: termOptions } = useGetTermOptions("th");

  const { isLoading, data: classOptions } = useGetStudentGroupOptions(
    queryKey?.academicTerm || "",
    "th"
  );

  const { data: students } = useGetStudentGroupByTermId(
    queryKey?.academicTerm || "",
    queryKey?.degreeLevel || "",
    queryKey?.grade || "",
    queryKey?.room || ""
  );

  const onSubmit: SubmitHandler<SearchEnrollmentByGroupDto> = (dto) => {
    const selectClass = classOptions.find((i) => i.value === dto.grade || "");
    console.log("--->", selectClass?.data, dto.academicTerm);
    setQueryKey({
      academicTerm: dto.academicTerm,
      degreeLevel: selectClass?.data.degreeLevel,
      grade: selectClass?.data?.grade?.toString() || "",
      room: selectClass?.data?.room?.toString() || "",
    });
  };

  return (
    <Container sx={{ padding: 4, display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            รายชื่อนักเรียน
          </Typography>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <SearchStudentForm
              classOptions={classOptions}
              termOptions={termOptions}
              onSubmit={onSubmit}
              onTermChange={(academicTerm) => {
                setQueryKey((o) => ({ ...o, academicTerm }));
              }}
            />
            <Grid size={12}>
              <Table
                columns={columns}
                data={students}
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

export default function ListPage() {
  return (
    <Suspense>
      <ListPageComp />
    </Suspense>
  );
}
