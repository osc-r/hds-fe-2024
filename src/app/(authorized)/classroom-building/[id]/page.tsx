"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import ClassroomBuildingForm, {
  ClassroomBuildingFormType,
} from "@/components/forms/classroom-building/ClassroomBuildingForm";
import {
  useGetBuildingById,
  useUpdateBuildingById,
} from "../../../../services/class-scheduler/class-scheduler.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetBuildingById(id as string);

  const { isPending, mutate } = useUpdateBuildingById(id as string, () => {
    router.back();
  });

  const onSubmit: SubmitHandler<ClassroomBuildingFormType> = (formData) => {
    mutate(formData);
  };
  return (
    <FormLayout title="แก้ไขข้อมูลอาคารเรียน">
      <Container maxWidth="sm">
        <ClassroomBuildingForm
          initialData={data}
          isLoading={isPending || isLoading}
          onSubmit={onSubmit}
        />
      </Container>
    </FormLayout>
  );
}
