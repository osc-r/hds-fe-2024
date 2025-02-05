"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import HolidayForm, {
  HolidayFormType,
} from "@/components/forms/holiday/HolidayForm";
import {
  useGetHolidayById,
  useUpdateHolidayById,
} from "../../../../services/calendar/calendar.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetHolidayById(id as string);

  const { isPending, mutate } = useUpdateHolidayById(id as string, () => {
    router.back();
  });

  const onSubmit: SubmitHandler<HolidayFormType> = (formData) => {
    mutate(formData);
  };
  return (
    <FormLayout title="แก้ไขข้อมูลวันหยุด">
      <Container maxWidth="sm">
        <HolidayForm
          initialData={data}
          isLoading={isPending || isLoading}
          onSubmit={onSubmit}
        />
      </Container>
    </FormLayout>
  );
}
