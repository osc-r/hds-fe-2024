"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ClassroomBuildingForm, {
  ClassroomBuildingFormType,
} from "@/components/forms/classroom-building/ClassroomBuildingForm";
import classSchedulerService from "../../../../services/class-scheduler/class-scheduler.service";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    ClassroomBuildingFormType
  >({
    mutationFn: async (body) => {
      return (await classSchedulerService.createBuilding(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
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
