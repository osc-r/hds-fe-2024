"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { Container } from "@mui/material";
import CurriculumSubjectForm, {
  CurriculumSubjectFormType,
} from "@/components/forms/curriculum-subject/CurriculumSubjectForm";
import { useGetDegreeOptions } from "../../../../services/option/option.hook";
import {
  useGetCorCurriculumOptions,
  useGetSubjectAreaOptions,
  useGetSubjectById,
  useGetSubjectTypeOptions,
  useUpdateSubjectById,
} from "../../../../services/subject/subject.hook";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetSubjectById(id as string);

  const { isPending, mutate } = useUpdateSubjectById(id as string, () => {
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
    <FormLayout title="แก้ไขรายวิชาของโรงเรียนสามัญ">
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
