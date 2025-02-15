"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ActivityForm, {
  ActivityFormType,
} from "@/components/forms/activity/ActivityForm";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";
import { useCreateNonAcademicActivity } from "../../../../services/non-academic-activity/non-academic-activity.hook";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useCreateNonAcademicActivity(() => {
    router.back();
  });

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
