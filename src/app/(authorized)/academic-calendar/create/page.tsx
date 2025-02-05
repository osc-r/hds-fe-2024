"use client";

import AcademicCalendarForm, {
  AcademicCalendarFormType,
} from "@/components/forms/academic-calendar/AcademicCalendarForm";
import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateTerm } from "../../../../services/calendar/calendar.hook";

export default function CreatePage() {
  const router = useRouter();

  const { isPending, mutate } = useCreateTerm(() => {
    router.back();
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
