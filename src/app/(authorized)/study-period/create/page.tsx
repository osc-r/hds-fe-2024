"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";
import StudyPeriodForm, {
  StudyPeriodFormType,
} from "@/components/forms/study-period/StudyPeriodForm";
import { useCreateStudyPeriod } from "../../../../services/class-scheduler/class-scheduler.hook";
import dayjs from "dayjs";

export default function CreatePage() {
  const router = useRouter();

  const { data: termOptions } = useGetTermOptions("th");

  const { isPending, mutate } = useCreateStudyPeriod(() => {
    router.back();
  });

  const onSubmit: SubmitHandler<StudyPeriodFormType> = (formData) => {
    mutate({
      academicTerm: formData.academicTerm,
      isStudyOnWeekend: formData.isStudyOnWeekend,
      name: formData.name,
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
    <FormLayout title="เพิ่มคาบเรียน">
      <Container maxWidth="md">
        <StudyPeriodForm
          onSubmit={onSubmit}
          isLoading={isPending}
          termOptions={termOptions}
        />
      </Container>
    </FormLayout>
  );
}
