"use client";

import AcademicCalendarForm, {
  AcademicCalendarFormType,
} from "@/components/forms/academic-calendar/AcademicCalendarForm";
import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import calendarService from "../../../../services/calendar/calendar.service";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    AcademicCalendarFormType
  >({
    mutationFn: async (body) => {
      return (await calendarService.createTerm(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const onSubmit: SubmitHandler<AcademicCalendarFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มปฏิทินการศึกษา">
      <AcademicCalendarForm onSubmit={onSubmit} isLoading={isPending} />
    </FormLayout>
  );
}
