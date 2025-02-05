"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ClassroomBuildingForm, {
  ClassroomBuildingFormType,
} from "@/components/forms/classroom-building/ClassroomBuildingForm";
import { useCreateBuilding } from "../../../../services/class-scheduler/class-scheduler.hook";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useCreateBuilding(() => {
    router.back();
  });

  const onSubmit: SubmitHandler<ClassroomBuildingFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มข้อมูลอาคารเรียน">
      <Container maxWidth="md">
        <ClassroomBuildingForm onSubmit={onSubmit} isLoading={isPending} />
      </Container>
    </FormLayout>
  );
}
