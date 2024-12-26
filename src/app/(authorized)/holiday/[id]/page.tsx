"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import calendarService from "../../../../services/calendar/calendar.service";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import HolidayForm, {
  HolidayFormType,
} from "@/components/forms/holiday/HolidayForm";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<unknown, unknown, HolidayFormType>({
    queryKey: [`holiday`, id],
    queryFn: () =>
      calendarService.getHolidayById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

  const { isPending, mutate } = useMutation<unknown, unknown, HolidayFormType>({
    mutationFn: async (body) => {
      return (await calendarService.updateHolidayById(id as string, body)).data;
    },
    onSuccess: () => {
      router.back();
    },
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
