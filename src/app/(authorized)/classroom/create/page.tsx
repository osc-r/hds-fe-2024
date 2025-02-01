"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import classSchedulerService from "../../../../services/class-scheduler/class-scheduler.service";
import ClassroomForm, {
  ClassroomFormType,
} from "@/components/forms/classroom/ClassroomForm";
import { Building } from "../../../../services/class-scheduler/class-scheduler";
import { Option } from "../../../../services/option/option";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    ClassroomFormType
  >({
    mutationFn: async (body) => {
      return (await classSchedulerService.createRoom(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const { isLoading: isLoadingBuildingOption, data: buildingOptions } =
    useQuery<
      Building[],
      unknown,
      {
        label: string;
        value: string;
      }[],
      string[]
    >({
      queryKey: ["classroom-building"],
      queryFn: () => {
        return classSchedulerService
          .getBuilding()
          .then((res) => res.data.data.result);
      },
      select: (data) => {
        return data.map((i) => ({ label: i.name, value: i._id }));
      },
      initialData: [],
    });

  const { isLoading: isLoadingRoomOption, data: roomOptions } = useQuery<
    Option,
    unknown,
    {
      label: string;
      value: string;
    }[]
  >({
    queryKey: ["room-option"],
    queryFn: () => {
      return classSchedulerService
        .getRoomTypeOption()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[LANG], value: key });
      }
      return output;
    },
    initialData: {},
  });

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
