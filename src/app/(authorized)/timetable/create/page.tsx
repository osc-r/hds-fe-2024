"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container, Grid2 as Grid } from "@mui/material";
import {
  useGetStudentGroupOptions,
  useGetTermOptions,
} from "../../../../services/calendar/calendar.hook";
import {
  useCreateTimetable,
  useGetActivityOptions,
  useGetRooms,
  useGetScheduleConfig,
} from "../../../../services/class-scheduler/class-scheduler.hook";
import TimetableForm, {
  TimetableFormType,
} from "@/components/forms/timetable/TimetableForm";
import { useState } from "react";
import { useGetInstructors } from "../../../../services/hdsv2-users/hdsv2-users.hook";

export default function CreatePage() {
  const router = useRouter();

  const { data: termOptions } = useGetTermOptions("th");
  const [queryKey, setQueryKey] = useState<{ academicTerm: string }>({
    academicTerm: "",
  });

  const { data: classOptions } = useGetStudentGroupOptions(
    queryKey?.academicTerm || "",
    "th"
  );

  const { isLoading, data, refetch } = useGetScheduleConfig(
    queryKey?.academicTerm
  );

  const { data: activityOptions } = useGetActivityOptions(
    queryKey?.academicTerm
  );

  const { data: instructorOptions } = useGetInstructors();
  const { data: classroomOptions } = useGetRooms();

  const { isPending, mutate } = useCreateTimetable(() => {
    router.back();
  });

  const onSubmit: SubmitHandler<TimetableFormType> = (formData) => {
    mutate({
      isoWeekday: parseInt(formData.isoWeekday),
      periodConfig: formData.periodConfig,
      studentGroup: formData.studentGroup,
      periodAssignments: formData.timeSlot.map((i) => {
        const reference = activityOptions.find((j) => j._id === i.activity);
        return {
          buildingRoom: i.buildingRoom,
          isCombinedClass: i.isCombinedClass,
          referenceId: reference?._id || "",
          referenceModel: reference?.referenceModel || "",
          instructors: [{ userId: i.instructor, role: 'lead' }],
        };
      }),
    });
  };

  return (
    <FormLayout title="เพิ่มตารางเรียนตารางสอน">
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <TimetableForm
              onSubmit={onSubmit}
              isLoading={isPending}
              termOptions={termOptions}
              classOptions={classOptions}
              configOptions={data.map((i) => ({
                label: i.name,
                value: i._id,
                data: i.timeSlot,
              }))}
              activityOptions={activityOptions.map((i) => ({
                label: i.en,
                value: i._id,
              }))}
              instructorOptions={instructorOptions.map((i) => ({
                label: i.fullname,
                value: i._id,
              }))}
              classroomOptions={classroomOptions.map((i) => ({
                label: i.name + " - " + i.building.name,
                value: i._id,
              }))}
              onAcademicTermChange={(academicTerm: string) => {
                setQueryKey({ academicTerm });
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </FormLayout>
  );
}
