"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import { Option } from "../../../../services/option/option";
import subjectService from "../../../../services/subject/subject.service";
import optionService from "../../../../services/option/option.service";
import CurriculumSubjectForm, {
  CurriculumSubjectFormType,
} from "@/components/forms/curriculum-subject/CurriculumSubjectForm";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    CurriculumSubjectFormType
  >({
    queryKey: [`curriculum`, id],
    queryFn: () =>
      subjectService.getSubjectById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    CurriculumSubjectFormType
  >({
    mutationFn: async (body) => {
      return (await subjectService.updateSubjectById(id as string, body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const { data: subjectAreaOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["subjectAreaOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectAreaOptions()
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
  });

  const { data: subjectTypeOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["subjectTypeOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectTypeOptions()
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
  });

  const { data: coreCurriculumOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["coreCurriculumOptions"],
    queryFn: () => {
      return subjectService
        .getCoreCurriculumOptions()
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
  });

  const { data: degreeOptions } = useQuery<
    Option,
    unknown,
    { label: string; value: string }[]
  >({
    queryKey: ["degreeOptions"],
    queryFn: () => {
      return optionService.getDegreeOptions().then((res) => res.data.data);
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

  const onSubmit: SubmitHandler<CurriculumSubjectFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มรายวิชาของโรงเรียนสามัญ">
      <Container maxWidth="md">
        <CurriculumSubjectForm
          onSubmit={onSubmit}
          isLoading={isPending || isLoading}
          initialData={data}
          curriculumOptions={coreCurriculumOptions || []}
          degreeLevelOptions={degreeOptions || []}
          subjectAreasOptions={subjectAreaOptions || []}
          subjectTypeOptions={subjectTypeOptions || []}
        />
      </Container>
    </FormLayout>
  );
}
