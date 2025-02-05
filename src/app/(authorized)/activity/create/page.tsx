"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ActivityForm, {
  ActivityFormType,
} from "@/components/forms/activity/ActivityForm";
import nonAcademicActivityService from "../../../../services/non-academic-activity/non-academic-activity.service";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<unknown, unknown, ActivityFormType>(
    {
      mutationFn: async (body) => {
        return (
          await nonAcademicActivityService.createNonAcademicActivity(body)
        ).data;
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  const { data: termOptions } = useGetTermOptions("th");

  const onSubmit: SubmitHandler<ActivityFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มข้อมูลโฮมรูมและกิจกรรมอื่นๆ">
      <Container maxWidth="md">
        <ActivityForm
          onSubmit={onSubmit}
          isLoading={isPending}
          termOptions={termOptions}
        />
      </Container>
    </FormLayout>
  );
}
