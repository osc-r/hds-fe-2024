import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EnrollmentByGroup,
  EnrollmentByStudent,
  IndividualEnrollDto,
  Subject,
  SubjectOffered,
} from "./subject";
import subjectService from "./subject.service";
import { Option } from "../option/option";
import { CurriculumSubjectFormType } from "@/components/forms/curriculum-subject/CurriculumSubjectForm";
import { CurriculumSubjectOfferedFormType } from "@/components/forms/curriculum-subject-offered/CurriculumSubjectOfferedForm";

const KEY = "SUBJECT_SERVICE";

export const useGetSubjects = (
  curriculum?: string,
  code?: string,
  name?: string,
  subjectType?: string,
  subjectAreas?: string,
  degreeLevel?: string,
  page?: string,
  limit?: string,
  offset?: string
) =>
  useQuery<unknown, unknown, Subject[], string[]>({
    queryKey: [
      KEY,
      "getSubjects",
      curriculum || "",
      code || "",
      name || "",
      subjectType || "",
      subjectAreas || "",
      degreeLevel || "",
      page || "",
      limit || "",
      offset || "",
    ],
    queryFn: ({ queryKey }) => {
      const [
        ,
        ,
        curriculum,
        code,
        name,
        subjectType,
        subjectAreas,
        degreeLevel,
        page,
        limit,
        offset,
      ] = queryKey;

      return subjectService
        .getSubjects({
          curriculum: curriculum || undefined,
          code: code || undefined,
          name: name || undefined,
          subjectType: subjectType || undefined,
          subjectAreas: subjectAreas || undefined,
          degreeLevel: degreeLevel || undefined,
          page: page || undefined,
          limit: limit || undefined,
          offset: offset || undefined,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
    initialData: [],
  });

export const useGetSubjectAreaOptions = (lang: string) =>
  useQuery<Option, unknown, { label: string; value: string }[]>({
    queryKey: [KEY, "getSubjectAreaOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectAreaOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[lang], value: key });
      }
      return output;
    },
    initialData: {},
  });

export const useGetSubjectTypeOptions = (lang: string) =>
  useQuery<Option, unknown, { label: string; value: string }[]>({
    queryKey: [KEY, "getSubjectTypeOptions"],
    queryFn: () => {
      return subjectService
        .getSubjectTypeOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[lang], value: key });
      }
      return output;
    },
    initialData: {},
  });

export const useGetCorCurriculumOptions = (lang: string) =>
  useQuery<Option, unknown, { label: string; value: string }[]>({
    queryKey: [KEY, "getCoreCurriculumOptions"],
    queryFn: () => {
      return subjectService
        .getCoreCurriculumOptions()
        .then((res) => res.data.data);
    },
    select: (data) => {
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[lang], value: key });
      }
      return output;
    },
  });

export const useDeleteSubjectById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await subjectService.deleteSubjectById(id)).data;
    },
    onSuccess,
  });

export const useGetSubjectById = (id: string) =>
  useQuery<unknown, unknown, CurriculumSubjectFormType>({
    queryKey: [KEY, "getSubjectById", id],
    queryFn: () =>
      subjectService.getSubjectById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

export const useUpdateSubjectById = (id: string, onSuccess: () => void) =>
  useMutation<unknown, unknown, CurriculumSubjectFormType>({
    mutationFn: async (body) => {
      return (await subjectService.updateSubjectById(id, body)).data;
    },
    onSuccess,
  });

export const useCreateSubject = (onSuccess: () => void) =>
  useMutation<unknown, unknown, CurriculumSubjectFormType>({
    mutationFn: async (body) => {
      return (await subjectService.createSubject(body)).data;
    },
    onSuccess,
  });

export const useDeleteOfferedById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await subjectService.deleteOfferedById(id)).data;
    },
    onSuccess,
  });

export const useGetOffered = (
  code?: string,
  name?: string,
  subjectType?: string,
  academicTerm?: string,
  degreeLevel?: string,
  grade?: string,
  room?: string
) =>
  useQuery<unknown, unknown, SubjectOffered[], string[]>({
    queryKey: [
      KEY,
      "getSubjectOffered",
      academicTerm || "",
      degreeLevel || "",
      grade || "",
      room || "",
      code || "",
      name || "",
      subjectType || "",
    ],
    queryFn: ({ queryKey }) => {
      const [
        ,
        ,
        academicTerm,
        degreeLevel,
        grade,
        room,
        code,
        name,
        subjectType,
      ] = queryKey;
      return subjectService
        .getSubjectOffered({
          academicTerm: academicTerm || undefined,
          degreeLevel: degreeLevel || undefined,
          grade: grade || undefined,
          room: room || undefined,
          ["subject.code"]: code || undefined,
          ["subject.name"]: name || undefined,
          ["subject.subjectType"]: subjectType || undefined,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
    initialData: [],
  });

export const useCreateSubjectOffered = (onSuccess: () => void) =>
  useMutation<unknown, unknown, CurriculumSubjectOfferedFormType>({
    mutationFn: async (body) => {
      return (await subjectService.createSubjectOffered(body)).data;
    },
    onSuccess,
  });

export const useGetEnrollmentByGroup = (
  academicTerm: string,
  degreeLevel?: string,
  grade?: string,
  room?: string
) =>
  useQuery<unknown, unknown, EnrollmentByGroup[], string[]>({
    queryKey: [
      KEY,
      "getEnrollmentByGroup",
      academicTerm || "",
      degreeLevel || "",
      grade || "",
      room || "",
    ],
    queryFn: ({ queryKey }) => {
      const [, , academicTerm, degreeLevel, grade, room] = queryKey;
      return subjectService
        .getEnrollmentByGroup({
          academicTerm,
          degreeLevel: degreeLevel || undefined,
          grade: grade || undefined,
          room: room || undefined,
        })
        .then((res) => res.data.data);
    },
    enabled: false,
    initialData: [],
  });

export const useGetEnrollmentByStudentId = (
  studentId: string,
  academicTermId: string
) =>
  useQuery<unknown, unknown, EnrollmentByStudent[], string[]>({
    queryKey: [KEY, "getEnrollmentByStudentId", studentId, academicTermId],
    queryFn: ({ queryKey }) => {
      const [, , studentId, academicTermId] = queryKey;

      return subjectService
        .getEnrollmentByStudentId(studentId, academicTermId)
        .then((res) => res.data.data);
    },
    enabled: false,
    initialData: [],
  });

export const useEnrollIndividual = (onSuccess: () => void) =>
  useMutation<unknown, unknown, IndividualEnrollDto>({
    mutationFn: async (body) => {
      return (await subjectService.individualEnroll(body)).data;
    },
    onSuccess,
  });
