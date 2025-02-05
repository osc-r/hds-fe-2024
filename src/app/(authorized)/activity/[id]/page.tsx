"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import ActivityForm, {
  ActivityFormType,
} from "@/components/forms/activity/ActivityForm";
import nonAcademicActivityService from "../../../../services/non-academic-activity/non-academic-activity.service";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<unknown, unknown, ActivityFormType>({
    queryKey: [`activity`, id],
    queryFn: () =>
      nonAcademicActivityService
        .getNonAcademicActivityById(id as string)
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
          return rest;
        }),
  });

  const { isPending, mutate } = useMutation<unknown, unknown, ActivityFormType>(
    {
      mutationFn: async (body) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { academicTerm, ..._body } = body;
        return (
          await nonAcademicActivityService.updateNonAcademicActivityById(
            id as string,
            _body
          )
        ).data;
      },
      onSuccess: () => {
        router.back();
      },
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
