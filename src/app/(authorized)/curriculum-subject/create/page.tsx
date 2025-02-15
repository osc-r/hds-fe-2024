"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import CurriculumSubjectForm, {
  CurriculumSubjectFormType,
} from "@/components/forms/curriculum-subject/CurriculumSubjectForm";
import { useGetDegreeOptions } from "../../../../services/option/option.hook";
import {
  useCreateSubject,
  useGetCorCurriculumOptions,
  useGetSubjectAreaOptions,
  useGetSubjectTypeOptions,
} from "../../../../services/subject/subject.hook";

export default function CreatePage() {
  const router = useRouter();

  const { isPending, mutate } = useCreateSubject(() => {
    router.back();
  });

  const { data: subjectAreaOptions } = useGetSubjectAreaOptions("th");

  const { data: subjectTypeOptions } = useGetSubjectTypeOptions("th");

  const { data: coreCurriculumOptions } = useGetCorCurriculumOptions("th");

  const { data: degreeOptions } = useGetDegreeOptions("th");

  const onSubmit: SubmitHandler<CurriculumSubjectFormType> = (formData) => {
    mutate(formData);
  };

  return (
    <FormLayout title="เพิ่มรายวิชาของโรงเรียนสามัญ">
      <Container maxWidth="md">
        <CurriculumSubjectForm
          onSubmit={onSubmit}
          isLoading={isPending}
          curriculumOptions={coreCurriculumOptions || []}
          degreeLevelOptions={degreeOptions || []}
          subjectAreasOptions={subjectAreaOptions || []}
          subjectTypeOptions={subjectTypeOptions || []}
        />
      </Container>
    </FormLayout>
  );
}
