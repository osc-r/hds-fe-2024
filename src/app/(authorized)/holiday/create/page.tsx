"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import calendarService from "../../../../services/calendar/calendar.service";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import HolidayForm, {
  HolidayFormType,
} from "@/components/forms/holiday/HolidayForm";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<unknown, unknown, HolidayFormType>({
    mutationFn: async (body) => {
      return (await calendarService.createHolidays(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
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
