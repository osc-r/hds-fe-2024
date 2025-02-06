"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import ClassroomForm, {
  ClassroomFormType,
} from "@/components/forms/classroom/ClassroomForm";
import {
  useGetBuilding,
  useGetRoomById,
  useGetRoomTypeOption,
  useUpdateRoomById,
} from "../../../../services/class-scheduler/class-scheduler.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetRoomById(id as string);

  const { isPending, mutate } = useUpdateRoomById(id as string, () => {
    router.back();
  });

  const { data: buildingOptions } = useGetBuilding((data) =>
    data.map((i) => ({ label: i.name, value: i._id }))
  );

  const { data: roomOptions } = useGetRoomTypeOption("th");

  const onSubmit: SubmitHandler<ClassroomFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="แก้ไขข้อมูลห้องเรียน">
      <Container maxWidth="sm">
        <ClassroomForm
          initialData={data}
          isLoading={isPending || isLoading}
          onSubmit={onSubmit}
          buildingOptions={buildingOptions}
          classroomTypeOptions={roomOptions}
        />
      </Container>
    </FormLayout>
  );
}
