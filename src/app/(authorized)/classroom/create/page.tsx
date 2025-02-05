"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ClassroomForm, {
  ClassroomFormType,
} from "@/components/forms/classroom/ClassroomForm";
import {
  useCreateRoom,
  useGetBuilding,
  useGetRoomTypeOption,
} from "../../../../services/class-scheduler/class-scheduler.hook";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useCreateRoom(() => {
    router.back();
  });

  const { isLoading: isLoadingBuildingOption, data: buildingOptions } =
    useGetBuilding((data) =>
      data.map((i) => ({ label: i.name, value: i._id }))
    );

  const { isLoading: isLoadingRoomOption, data: roomOptions } =
    useGetRoomTypeOption("th");

  const onSubmit: SubmitHandler<ClassroomFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มข้อมูลห้องเรียน">
      <Container maxWidth="md">
        <ClassroomForm
          onSubmit={onSubmit}
          isLoading={isPending}
          buildingOptions={buildingOptions}
          classroomTypeOptions={roomOptions}
        />
      </Container>
    </FormLayout>
  );
}
