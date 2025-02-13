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
import { Option } from "../../../../services/option/option";
import optionService from "../../../../services/option/option.service";
import hdsv2GroupsService from "../../../../services/hdsv2-groups/hdsv2-groups.service";
import { GroupOption } from "../../../../services/hdsv2-groups/hdsv2-groups";
import { useState } from "react";
import { useGetTermOptions } from "../../../../services/calendar/calendar.hook";

export default function CreatePage() {
  const router = useRouter();

  const [degreeLevel, setDegreeLevel] = useState("");

  const { isPending, mutate } = useMutation<
    unknown,
    unknown,
    CurriculumSubjectOfferedFormType
  >({
    mutationFn: async (body) => {
      return (await subjectService.createSubjectOffered(body)).data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const { data: termOptions } = useGetTermOptions("th");

  const { data: classOptions } = useQuery<
    GroupOption[],
    unknown,
    {
      label: string;
      value: string;
      data: {
        degreeLevel: string;
        grade: string;
        room: string;
      };
    }[]
  >({
    queryKey: ["classOptions", degreeLevel],
    queryFn: (ctx) => {
      return hdsv2GroupsService
        .getGroupsOption("full", { degreeLevel: ctx.queryKey[1] })
        .then((res) => res.data.data.result);
    },
    select: (data) => {
      const LANG = "th";
      const output: {
        label: string;
        value: string;
        data: {
          degreeLevel: string;
          grade: string;
          room: string;
        };
      }[] = [];
      data.forEach((item) => {
        output.push({
          label: item[LANG],
          value: item.queryString,
          data: item.query,
        });
      });
      return output;
    },
    initialData: [],
  });

  const { data: subjectOptions } = useQuery({
    queryKey: ["subjectOptions", degreeLevel],
    queryFn: () => {
      return subjectService
        .getSubjects({ degreeLevel })
        .then((res) => res.data.data);
    },
    select: (data) => {
      const LANG = "th";
      return data.result.map((i) => ({
        label: i.code[LANG],
        value: i._id,
        data: i,
      }));
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
    initialData: {},
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
    initialData: {},
  });

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
        grade: parseInt(selectedClass?.data.grade) || 0,
        room: parseInt(selectedClass?.data.room) || 0,
      });
    }
  };

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
