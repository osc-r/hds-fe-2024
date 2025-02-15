"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import ActivityForm, {
  ActivityFormType,
} from "@/components/forms/activity/ActivityForm";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";
import {
  useGetNonAcademicActivityById,
  useUpdateNonAcademicActivityById,
} from "../../../../services/non-academic-activity/non-academic-activity.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetNonAcademicActivityById(id as string);

  const { isPending, mutate } = useUpdateNonAcademicActivityById(
    id as string,
    () => {
      router.back();
    }
  );

  const { data: termOptions } = useGetTermOptions("th");

  const onSubmit: SubmitHandler<ActivityFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="แก้ไขข้อมูลโฮมรูมและกิจกรรมอื่นๆ">
      <Container maxWidth="sm">
        <ActivityForm
          initialData={data}
          isLoading={isPending || isLoading}
          onSubmit={onSubmit}
          termOptions={termOptions}
        />
      </Container>
    </FormLayout>
  );
}
