"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import subjectService from "../../../../services/subject/subject.service";
import {
  GroupEnrollDto,
  SubjectOffered,
} from "../../../../services/subject/subject";
import {
  Student,
  StudentGroup,
  TermOption,
} from "../../../../services/calendar/calendar";
import hdsv2GroupsService from "../../../../services/hdsv2-groups/hdsv2-groups.service";
import { GroupOption } from "../../../../services/hdsv2-groups/hdsv2-groups";
import Table, { TableColumnProps } from "@/components/Table";
import React, { useEffect, useState } from "react";
import {
  useGetStudentGroupByTermId,
  useGetTermOptions,
} from "../../../../services/calendar/calendar.hook";

const columns: TableColumnProps<Student>[] = [
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
];

const subjectColumns: TableColumnProps<SubjectOffered>[] = [
  {
    field: "subject.code.en",
    headerName: "รหัสวิชา",
    headerCellProps: {
      align: "center",
      sx: { width: 96 },
    },
    cellProps: { align: "center", sx: { width: 96 } },
  },
  {
    field: "subject.name.en",
    headerName: "ชื่อวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "left" },
  },
];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subjectOffered, setSubjectOffered] = useState<
    {
      label: string;
      data: SubjectOffered[];
    }[]
  >([]);
  const [checked, setChecked] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number[]>(
    []
  );

  const [checkedSubjects, setCheckedSubjects] = useState<boolean[]>([]);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState<number[][]>(
    []
  );

  const academicTerm = searchParams.get("academicTerm");
  const degreeLevel = searchParams.get("degreeLevel");
  const grade = searchParams.get("grade");
  const room = searchParams.get("room");

  const query = {
    degreeLevel: degreeLevel || "",
    grade: grade || "",
    room: room || "",
  };

  const generateQuery = new URLSearchParams(query).toString();

  const { data: currentTerm, isLoading } = useGetTermOptions("th", (data) => {
    const LANG = "th";

    let label = "-";
    for (const [key, value] of Object.entries(data)) {
      if (key === academicTerm) {
        label = value[LANG];
      }
    }
    return label;
  });

  const { data: currentClass } = useQuery<GroupOption[], unknown, string>({
    queryKey: ["classOptions"],
    queryFn: () => {
      return hdsv2GroupsService
        .getGroupsOption("full")
        .then((res) => res.data.data.result);
    },
    select: (data) => {
      const LANG = "th";

      let label = "-";
      data.forEach((item) => {
        if (item.queryString === generateQuery) {
          label = item[LANG];
        }
      });
      return label;
    },
    initialData: [],
  });

  const { data: students } = useGetStudentGroupByTermId(
    academicTerm || "",
    degreeLevel || "",
    grade || "",
    room || ""
  );

  useEffect(() => {
    (async () => {
      await subjectService.getSubjectTypeOptions().then(async (res) => {
        const LANG = "th";
        const arr = [];
        for (const [key, value] of Object.entries(res.data.data)) {
          arr.push(
            subjectService
              .getSubjectOffered({
                academicTerm: academicTerm || "",
                degreeLevel: degreeLevel || undefined,
                grade: grade || undefined,
                room: room || undefined,
                "subject.subjectType": key,
              })
              .then((res) => ({
                label: value[LANG],
                data: res.data.data.result,
              }))
          );
        }
        setSubjectOffered(await Promise.all(arr));
        setSelectedSubjectIndex(new Array(arr.length).fill([]));
        setCheckedSubjects(new Array(arr.length).fill(false));
      });
    })();
  }, [academicTerm, degreeLevel, grade, room]);

  const { isPending, mutate } = useMutation<unknown, unknown, GroupEnrollDto>({
    mutationFn: async (body) => {
      return (await subjectService.groupEnroll(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const onSubmit = () => {
    mutate({
      studentIds: selectedStudentIndex.map((i) => students[i]._id),
      offeredSubjectIds: subjectOffered
        .map((i) => i.data.map((j) => j._id))
        .reduce((a, b) => {
          return [...a, ...b];
        }, [] as string[]),
    });
  };

  return (
    <FormLayout title="ลงทะเบียนตามชั้นเรียน">
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid size={4}>
            <Typography>ภาคเรียน: {currentTerm}</Typography>
          </Grid>
          <Grid size={4}>
            <Typography>ชั้นเรียน: {currentClass}</Typography>
          </Grid>
          <Grid size={4} sx={{ textAlign: "end" }}>
            <Button variant="outlined" onClick={onSubmit} disabled={isPending}>
              ลงทะเบียนตามรายการที่เลือก
            </Button>
          </Grid>
          <Grid size={12} sx={{ mb: 4 }}>
            <Divider />
          </Grid>

          <Grid container size={12} spacing={4}>
            <Grid size={5.75}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">รายชื่อนักเรียน</Typography>
                <FormControlLabel
                  label="เลือกทั้งหมด"
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(_, _checked) => {
                        setChecked(_checked);
                        if (_checked) {
                          setSelectedStudentIndex(
                            students.map((_, index) => index)
                          );
                        } else {
                          setSelectedStudentIndex([]);
                        }
                      }}
                    />
                  }
                />
              </Box>
              <Table
                columns={columns}
                data={students || []}
                showNumber
                hideCheckAll
                loading={isLoading}
                checkedIndex={selectedStudentIndex}
                onCheckChange={(arr) => {
                  setSelectedStudentIndex(arr);
                  setChecked(arr.length === students.length);
                }}
                tableMinWidth={null}
              />
            </Grid>
            <Grid
              size={0.5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Divider orientation="vertical" />
            </Grid>
            <Grid size={5.75}>
              {subjectOffered.map((i, index) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">{i.label}</Typography>
                    <FormControlLabel
                      label="เลือกทั้งหมด"
                      control={
                        <Checkbox
                          checked={checkedSubjects[index]}
                          onChange={(_, _checked) => {
                            setCheckedSubjects((o) => {
                              const updated = [...o];
                              updated[index] = _checked;
                              return updated;
                            });
                            if (_checked) {
                              setSelectedSubjectIndex((o) => {
                                const updated = [...o];
                                updated[index] = i.data.map(
                                  (_, _index) => _index
                                );
                                return updated;
                              });
                            } else {
                              setSelectedSubjectIndex((o) => {
                                const updated = [...o];
                                updated[index] = [];
                                return updated;
                              });
                            }
                          }}
                        />
                      }
                    />
                  </Box>
                  <Table
                    columns={subjectColumns}
                    data={i.data || []}
                    showNumber
                    hideCheckAll
                    loading={isLoading}
                    checkedIndex={selectedSubjectIndex[index]}
                    onCheckChange={(data) => {
                      setSelectedSubjectIndex((o) => {
                        const updated = [...o];
                        updated[index] = data;
                        return updated;
                      });
                      setCheckedSubjects((o) => {
                        const updated = [...o];
                        updated[index] = data.length === i.data.length;
                        return updated;
                      });
                    }}
                    tableMinWidth={null}
                  />
                  <Box sx={{ mb: 6 }} />
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
        {/* <HolidayForm onSubmit={onSubmit} isLoading={isPending} /> */}
      </Container>
    </FormLayout>
  );
}
