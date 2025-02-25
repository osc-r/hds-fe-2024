"use client";

import {
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { EnrollmentByStudent } from "../../../services/subject/subject";
import { useGetTermOptions } from "../../../services/calendar/calendar.hook";
import { Suspense } from "react";
import SearchEnrollmentIndividualForm, {
  SearchEnrollmentIndividualFormType,
} from "@/components/forms/enrollment-individual/SearchEnrollmentIndividualForm";
import { useGetGroupOption } from "../../../services/hdsv2-groups/hdsv2-groups.hook";
import { useGetEnrollmentByStudentId } from "../../../services/subject/subject.hook";
import { useRouter } from "next/navigation";

const columns: TableColumnProps<EnrollmentByStudent>[] = [
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
    cellProps: { align: "center" },
  },
  {
    field: "subject.credit",
    headerName: "หน่วยกิต",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "วันที่เรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "offered",
    headerName: "ชั้นเรียน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return row.degreeLevel + " " + row.grade + "/" + row.room;
    },
  },
  {
    field: "offered",
    headerName: "ครูผู้สอน",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
];

function ListPageComp() {
  const router = useRouter();

  const [queryKey, setQueryKey] =
    useState<SearchEnrollmentIndividualFormType>();

  const { data: termOptions } = useGetTermOptions("th");

  const { data: classOptions } = useGetGroupOption("th");

  const { data, refetch, isLoading } = useGetEnrollmentByStudentId(
    queryKey?.studentId || "",
    queryKey?.academicTerm || ""
  );

  const onSearch: SubmitHandler<SearchEnrollmentIndividualFormType> = (dto) => {
    setQueryKey({
      ...dto,
    });
    setTimeout(refetch, 300);
  };

  return (
    <Container sx={{ padding: 4, display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ลงทะเบียน/เพิ่ม/ถอน รายบุคคล
          </Typography>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid container size={6} spacing={2}>
          <SearchEnrollmentIndividualForm
            classOptions={classOptions}
            termOptions={termOptions}
            onSubmit={onSearch}
          />
        </Grid>
        {queryKey?.studentId && (
          <Grid container size={6} spacing={2}>
            <Grid size={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={() =>
                  router.push(
                    `/enrollment-individual/${queryKey?.studentId}/${queryKey.academicTerm}`
                  )
                }
              >
                เพิ่มรายวิชาที่ลงทะเบียน
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid size={12}>
          <Table columns={columns} data={data} showNumber loading={isLoading} />
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
