"use client";

import AcademicCalendarForm, {
  AcademicCalendarFormType,
} from "@/components/forms/academic-calendar/AcademicCalendarForm";
import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import {
  useGetTermById,
  useUpdateTermById,
} from "../../../../services/calendar/calendar.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetTermById(id as string);

  const { isPending, mutate } = useUpdateTermById(id as string, () => {
    router.back();
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
