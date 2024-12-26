"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import subjectService from "../../../../services/subject/subject.service";
import CurriculumSubjectOfferedForm, {
  CurriculumSubjectOfferedFormType,
} from "@/components/forms/curriculum-subject-offered/CurriculumSubjectOfferedForm";
import hdsv2GroupsService from "../../../../services/hdsv2-groups/hdsv2-groups.service";
import calendarService from "../../../../services/calendar/calendar.service";

export default function CreatePage() {
  const router = useRouter();
  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    CurriculumSubjectOfferedFormType
  >({
    mutationFn: async (body) => {
      return (await subjectService.createSubject(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const { data: termOptions } = useQuery<
    unknown,
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
  });

  const { data: classOptions } = useQuery<
    unknown,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["classOptions"],
    queryFn: () => {
      return hdsv2GroupsService
        .getGroupsOption("full", { degreeLevel: "KINDER_GARDEN" })
        .then((res) => res.data.data.result);
    },
    select: (data) => {
      const LANG = "th";
      const output: { label: string; value: string }[] = [];
      data.forEach((item) => {
        output.push({ label: item[LANG], value: item.queryString });
      });
      // for (const [key, value] of Object.entries(data)) {
      // }
      return output;
    },
  });

  const { data: subjectOptions } = useQuery({
    queryKey: ["subjectOptions"],
    queryFn: () => {
      return subjectService.getSubjects().then((res) => res.data.data);
    },
  });

  // const { data: degreeOptions } = useQuery<
  //   Option,
  //   unknown,
  //   { label: string; value: string }[]
  // >({
  //   queryKey: ["degreeOptions"],
  //   queryFn: () => {
  //     return optionService.getDegreeOptions().then((res) => res.data.data);
  //   },

  // });

  const onSubmit: SubmitHandler<CurriculumSubjectOfferedFormType> = (
    formData
  ) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มรายวิชาที่เปิดสอน">
      <Container maxWidth="md">
        <CurriculumSubjectOfferedForm
          onSubmit={onSubmit}
          isLoading={isPending}
          academicTermOptions={termOptions || []}
          classOptions={classOptions || []}
        />
      </Container>
    </FormLayout>
  );
}
