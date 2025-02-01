"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import ClassroomBuildingForm, {
  ClassroomBuildingFormType,
} from "@/components/forms/classroom-building/ClassroomBuildingForm";
import classSchedulerService from "../../../../services/class-scheduler/class-scheduler.service";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    ClassroomBuildingFormType
  >({
    queryKey: [`classroom-building`, id],
    queryFn: () =>
      classSchedulerService.getBuildingById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, kind, ...rest } = res.data.data;
        return rest;
      }),
  });

  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    ClassroomBuildingFormType
  >({
    mutationFn: async (body) => {
      return (
        await classSchedulerService.updateBuildingById(id as string, body)
      ).data;
    },
    onSuccess: () => {
      router.back();
    },
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
