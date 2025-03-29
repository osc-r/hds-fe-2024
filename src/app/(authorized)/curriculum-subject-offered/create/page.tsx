"use client";

import FormLayout from "../../../../layouts/FormLayout";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import CurriculumSubjectOfferedForm, {
  CurriculumSubjectOfferedFormType,
} from "@/components/forms/curriculum-subject-offered/CurriculumSubjectOfferedForm";
import { useEffect, useState } from "react";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";
import { useGetGroupOption } from "../../../../services/hdsv2-groups/hdsv2-groups.hook";
import { useGetDegreeOptions } from "../../../../services/option/option.hook";
import {
  useCreateSubjectOffered,
  useGetSubjectAreaOptions,
  useGetSubjects,
  useGetSubjectTypeOptions,
} from "../../../../services/subject/subject.hook";

export default function CreatePage() {
  const router = useRouter();

  const [degreeLevel, setDegreeLevel] = useState("");

  const { isPending, mutate } = useCreateSubjectOffered(() => {
    router.back();
  });

  const { data: termOptions } = useGetTermOptions("th");

  const { data: classOptions } = useGetGroupOption("th", degreeLevel);

  const { data, refetch } = useGetSubjects(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    degreeLevel
  );

  const subjectOptions = data.map((i) => ({
    label: i.code["th"],
    value: i._id,
    data: i,
  }));

  const { data: degreeOptions } = useGetDegreeOptions("th");

  const { data: subjectAreaOptions } = useGetSubjectAreaOptions("th");

  const { data: subjectTypeOptions } = useGetSubjectTypeOptions("th");

  const onSubmit: SubmitHandler<CurriculumSubjectOfferedFormType> = (
    formData
  ) => {
    const subjectList = formData._subjectList?.map((i) => i.id) || [];
    const selectedClass = classOptions.find(
      (i) => i.value === (formData.grade as unknown as string)
    );

    delete formData.subject;
    delete formData._subjectList;

    if (selectedClass) {
      mutate({
        ...formData,
        subjectList,
        grade: parseInt(selectedClass?.data?.grade) || 0,
        room: parseInt(selectedClass?.data?.room) || 0,
      });
    }
  };

  useEffect(() => {
    refetch();
  }, [degreeLevel]);

  return (
    <FormLayout title="เพิ่มรายวิชาที่เปิดสอน">
      <Container maxWidth="md">
        <CurriculumSubjectOfferedForm
          onSubmit={onSubmit}
          isLoading={isPending}
          academicTermOptions={termOptions || []}
          degreeLevelOptions={degreeOptions || []}
          classOptions={classOptions || []}
          subjectOptions={subjectOptions || []}
          subjectAreaOptions={subjectAreaOptions}
          subjectTypeOptions={subjectTypeOptions}
          onDegreeLevelChange={(_degreeLevel) => {
            setDegreeLevel(_degreeLevel);
          }}
        />
      </Container>
    </FormLayout>
  );
}
