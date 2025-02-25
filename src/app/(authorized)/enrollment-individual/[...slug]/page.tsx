"use client";

import {
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useEffect, useState } from "react";
import {
  EnrollmentByStudent,
  SubjectOffered,
} from "../../../../services/subject/subject";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";
import { Suspense } from "react";
import {
  useEnrollIndividual,
  useGetEnrollmentByStudentId,
  useGetOffered,
} from "../../../../services/subject/subject.hook";
import { useParams, useRouter } from "next/navigation";
import { useGetStudentById } from "../../../../services/hdsv2-students/hdsv2-students.hook";
import FormLayout from "../../../../layouts/FormLayout";
import SearchSubjectModal from "@/components/modals/search-subject";
import { SearchSubjectFormType } from "@/components/forms/enrollment-individual/SearchSubjectForm";
import { SubmitHandler } from "react-hook-form";

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

function EditPageComp() {
  const router = useRouter();
  const { slug } = useParams();
  const [studentId, academicTermId] = slug || [];
  const [open, setOpen] = useState(false);
  const [queryKey, setQueryKey] = useState<SearchSubjectFormType>();

  const [newSubjects, setNewSubjects] = useState<SubjectOffered[]>([]);

  const { data: student } = useGetStudentById(studentId as string);

  const { data: termOptions } = useGetTermOptions("th");

  const { data, isLoading, refetch } = useGetEnrollmentByStudentId(
    studentId,
    academicTermId
  );

  const { data: subjects, refetch: refetchSubject } = useGetOffered(
    queryKey?.code,
    queryKey?.name
  );

  const { isPending, mutate } = useEnrollIndividual(() => {
    router.back();
  });

  useEffect(() => {
    refetch();
  }, []);

  const onSearch: SubmitHandler<SearchSubjectFormType> = (dto) => {
    setQueryKey(dto);
    setTimeout(refetchSubject, 300);
  };

  return (
    <FormLayout title="ลงทะเบียน/เพิ่ม/ถอน รายบุคคล">
      <Container sx={{ padding: 4, display: "flex" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={12}>
            <Typography variant="h6">ข้อมูลนักเรียน</Typography>
          </Grid>
          <Grid size={12} sx={{ display: "flex" }}>
            <Typography color="textDisabled">ภาคเรียน:</Typography>
            <Typography sx={{ ml: 1 }}>
              {termOptions.find((i: any) => i.value === academicTermId)?.label}
            </Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">ชื่อ - นามสกุล:</Typography>
            <Typography sx={{ ml: 1 }}>
              {student?.firstName?.th} {student?.lastName?.th}
            </Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">ชั้น:</Typography>
            <Typography sx={{ ml: 1 }}>
              {student?.degreeLevel} {student?.grade}/{student?.room}
            </Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">สถานะนักเรียน:</Typography>
            <Typography sx={{ ml: 1 }}>{student?.status}</Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">เบอร์:</Typography>
            <Typography sx={{ ml: 1 }}>
              {student?.phoneNumber || "-"}
            </Typography>
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">อีเมล:</Typography>
            <Typography sx={{ ml: 1 }}>{student?.email || "-"}</Typography>
          </Grid>
          <Grid size={12}>
            <Divider />
            <br />
          </Grid>
          <Grid size={12} sx={{ gap: 2 }}>
            <Typography variant="h6">รายวิชาที่ลงทะเบียน</Typography>
          </Grid>
          <Grid size={12}>
            <Table
              columns={columns}
              data={data}
              showNumber
              loading={isLoading}
            />
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">จำนวนหน่วยกิตรวม:</Typography>
            <Typography sx={{ ml: 1 }}>
              {
                data.reduce(
                  (a, b) => {
                    return {
                      subject: { credit: a.subject.credit + b.subject.credit },
                    } as unknown as EnrollmentByStudent;
                  },
                  {
                    subject: { credit: 0 },
                  } as unknown as EnrollmentByStudent
                ).subject.credit
              }
            </Typography>
          </Grid>
          <Grid size={12}>
            <br />
            <Divider />
            <br />
          </Grid>
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="h6">รายวิชาที่ลงทะเบียนเพิ่ม</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              เพิ่มรายวิชาที่ลงทะเบียน
            </Button>
          </Grid>
          <Grid size={12}>
            <Table
              columns={columns}
              data={newSubjects}
              showNumber
              loading={isLoading}
            />
          </Grid>
          <Grid size={4} sx={{ display: "flex" }}>
            <Typography color="textDisabled">จำนวนหน่วยกิตรวม:</Typography>
            <Typography sx={{ ml: 1 }}>
              {
                newSubjects.reduce(
                  (a, b) => {
                    return {
                      subject: { credit: a.subject.credit + b.subject.credit },
                    } as unknown as EnrollmentByStudent;
                  },
                  {
                    subject: { credit: 0 },
                  } as unknown as EnrollmentByStudent
                ).subject.credit
              }
            </Typography>
          </Grid>
          {newSubjects.length > 0 && (
            <Grid
              size={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  mutate({
                    offeredSubjectIds: newSubjects.map((i) => i._id),
                    replace: true,
                    studentId: studentId,
                  })
                }
              >
                ลงทะเบียน
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
      <SearchSubjectModal
        subjects={subjects}
        onSearch={onSearch}
        open={open}
        onClose={() => setOpen(false)}
        onSelectSubject={(subject) => {
          setOpen(false);
          setNewSubjects((o) => [
            ...o.filter((i) => i._id !== subject._id),
            subject,
          ]);
        }}
      />
    </FormLayout>
  );
}

export default function EditPage() {
  return (
    <Suspense>
      <EditPageComp />
    </Suspense>
  );
}
