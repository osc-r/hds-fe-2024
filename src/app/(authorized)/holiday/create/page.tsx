"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import HolidayForm, {
  HolidayFormType,
} from "@/components/forms/holiday/HolidayForm";
import { useCreateHoliday } from "../../../../services/calendar/calendar.hook";

export default function CreatePage() {
  const router = useRouter();

  const { isPending, mutate } = useCreateHoliday(() => {
    router.back();
  });

  const onSubmit: SubmitHandler<HolidayFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มข้อมูลวันหยุด">
      <Container maxWidth="md">
        <HolidayForm onSubmit={onSubmit} isLoading={isPending} />
      </Container>
    </FormLayout>
  );
}
