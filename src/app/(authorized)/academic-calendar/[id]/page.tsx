"use client";

import AcademicCalendarForm, {
  AcademicCalendarFormType,
} from "@/components/forms/academic-calendar/AcademicCalendarForm";
import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import calendarService from "../../../../services/calendar/calendar.service";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    AcademicCalendarFormType
  >({
    queryKey: [`academicCalendar`, id],
    queryFn: () =>
      calendarService.getTermById(id as string).then((res) => {
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    AcademicCalendarFormType
  >({
    mutationFn: async (body) => {
      return (await calendarService.updateTermById(id as string, body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const onSubmit: SubmitHandler<AcademicCalendarFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="แก้ไขปฏิทินการศึกษา">
      <AcademicCalendarForm
        initialData={data}
        isLoading={isPending || isLoading}
        onSubmit={onSubmit}
      />
    </FormLayout>
  );
}
