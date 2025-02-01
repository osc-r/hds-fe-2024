"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import ActivityForm, {
  ActivityFormType,
} from "@/components/forms/activity/ActivityForm";
import { TermOption } from "../../../../services/calendar/calendar";
import calendarService from "../../../../services/calendar/calendar.service";
import nonAcademicActivityService from "../../../../services/non-academic-activity/non-academic-activity.service";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<unknown, unknown, ActivityFormType>(
    {
      mutationFn: async (body) => {
        return (
          await nonAcademicActivityService.createNonAcademicActivity(body)
        ).data;
      },
      onSuccess: () => {
        router.back();
      },
    }
  );

  const { data: termOptions } = useQuery<
    TermOption,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["termOptions"],
    queryFn: () => {
      return calendarService.getTermOptions().then((res) => res.data.data);
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

  const onSubmit: SubmitHandler<ActivityFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มข้อมูลโฮมรูมและกิจกรรมอื่นๆ">
      <Container maxWidth="md">
        <ActivityForm
          onSubmit={onSubmit}
          isLoading={isPending}
          termOptions={termOptions}
        />
      </Container>
    </FormLayout>
  );
}
