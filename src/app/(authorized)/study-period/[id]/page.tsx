"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import StudyPeriodForm, {
  StudyPeriodFormType,
} from "@/components/forms/study-period/StudyPeriodForm";
import {
  useGetScheduleConfigById,
  useUpdateScheduleConfigById,
} from "../../../../services/class-scheduler/class-scheduler.hook";
import dayjs from "dayjs";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: termOptions } = useGetTermOptions("th");

  const { data, isLoading } = useGetScheduleConfigById(id as string);

  const { isPending, mutate } = useUpdateScheduleConfigById(
    id as string,
    () => {
      router.back();
    }
  );

  const onSubmit: SubmitHandler<StudyPeriodFormType> = (formData) => {
    mutate({
      isStudyOnWeekend: formData.isStudyOnWeekend,
      timeSlot: formData.timeSlot.map((i) => {
        const startAt = dayjs(i.startAt);
        const endAt = dayjs(i.endAt);
        return {
          startAt: {
            h: startAt.get("hours"),
            m: startAt.get("minutes"),
          },
          endAt: {
            h: endAt.get("hours"),
            m: endAt.get("minutes"),
          },
        };
      }),
    });
  };

  return (
    <FormLayout title="แก้ไขข้อมูลคาบเรียน">
      <Container maxWidth="sm">
        <StudyPeriodForm
          initialData={{
            ...data,
            openingTime: dayjs()
              .set("hour", data.timeSlot[0]?.startAt?.h || 0)
              .set("minute", data.timeSlot[0]?.startAt?.m || 0)
              .toISOString(),
            closingTime: dayjs()
              .set("hour", data.timeSlot[data.timeSlot.length - 1]?.endAt?.h || 0)
              .set("minute", data.timeSlot[data.timeSlot.length - 1]?.endAt?.m || 0)
              .toISOString(),
            numberOfPeriods: data.timeSlot.length,
            timeSlot: data.timeSlot.map((i) => ({
              startAt: dayjs()
                .set("hour", i.startAt.h)
                .set("minute", i.startAt.m)
                .toISOString(),
              endAt: dayjs()
                .set("hour", i.endAt.h)
                .set("minute", i.endAt.m)
                .toISOString(),
            })),
          }}
          isLoading={isPending || isLoading}
          onSubmit={onSubmit}
          termOptions={termOptions}
        />
      </Container>
    </FormLayout>
  );
}
