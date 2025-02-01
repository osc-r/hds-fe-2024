"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import classSchedulerService from "../../../../services/class-scheduler/class-scheduler.service";
import ClassroomForm, {
  ClassroomFormType,
} from "@/components/forms/classroom/ClassroomForm";
import { Building } from "../../../../services/class-scheduler/class-scheduler";
import { Option } from "../../../../services/option/option";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<unknown, unknown, ClassroomFormType>({
    queryKey: [`classroom`, id],
    queryFn: () =>
      classSchedulerService.getRoomById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, kind, ...rest } = res.data.data;
        return rest;
      }),
  });

  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    ClassroomFormType
  >({
    mutationFn: async (body) => {
      return (await classSchedulerService.updateRoomById(id as string, body))
        .data;
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
