import { useMutation, useQuery } from "@tanstack/react-query";
import calendarService from "./calendar.service";
import { AcademicCalendarFormType } from "@/components/forms/academic-calendar/AcademicCalendarForm";
import { StudentGroup, TermOption } from "./calendar";
import { HolidayFormType } from "@/components/forms/holiday/HolidayForm";

const KEY = "CALENDAR_SERVICE";

export const useGetTerms = () =>
  useQuery({
    queryKey: [KEY, "getTerms"],
    queryFn: () =>
      calendarService.getTerms().then((res) => res.data.data.result),
    initialData: [],
  });

export const useGetTermById = (id: string) =>
  useQuery({
    queryKey: [KEY, "useGetTermById", id],
    queryFn: () =>
      calendarService.getTermById(id).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

export const useDeleteTermById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await calendarService.deleteTermById(id)).data;
    },
    onSuccess,
  });

export const useUpdateTermById = (id: string, onSuccess: () => void) =>
  useMutation<unknown, unknown, AcademicCalendarFormType>({
    mutationFn: async (body) => {
      return (await calendarService.updateTermById(id, body)).data;
    },
    onSuccess,
  });

export const useCreateTerm = (onSuccess: () => void) =>
  useMutation<unknown, unknown, AcademicCalendarFormType>({
    mutationFn: async (body) => {
      return (await calendarService.createTerm(body)).data;
    },
    onSuccess,
  });

export const useGetTermOptions = (
  lang: string,
  selectFn?: (data: TermOption) => any
) =>
  useQuery({
    queryKey: [KEY, "getTermOptions"],
    queryFn: () => {
      return calendarService.getTermOptions().then((res) => res.data.data);
    },
    select: (data) => {
      if (selectFn) {
        return selectFn(data);
      }
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[lang], value: key });
      }
      return output;
    },
    initialData: {},
  });

/** */
export const useDeleteHolidayById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await calendarService.deleteHolidayById(id)).data;
    },
    onSuccess,
  });

export const useCreateHoliday = (onSuccess: () => void) =>
  useMutation<unknown, unknown, HolidayFormType>({
    mutationFn: async (body) => {
      return (await calendarService.createHolidays(body)).data;
    },
    onSuccess,
  });

export const useUpdateHolidayById = (id: string, onSuccess: () => void) =>
  useMutation<unknown, unknown, HolidayFormType>({
    mutationFn: async (body) => {
      return (await calendarService.updateHolidayById(id, body)).data;
    },
    onSuccess,
  });

export const useGetHolidayById = (id: string) =>
  useQuery<unknown, unknown, HolidayFormType>({
    queryKey: [KEY, "getHolidayById", id],
    queryFn: () =>
      calendarService.getHolidayById(id).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
        return rest;
      }),
  });

export const useGetHolidays = (academicYear?: string, month?: string) =>
  useQuery({
    queryKey: [KEY, "getHolidays", academicYear || "", month || ""],
    queryFn: ({ queryKey }) => {
      const [, academicYear, month] = queryKey;
      return calendarService
        .getHolidays({
          academicYear: academicYear || undefined,
          month: month || undefined,
        })
        .then((res) => res.data.data.result);
    },
    enabled: false,
  });

/** */
export const useGetStudentGroupByTermId = (
  academicTerm: string,
  degreeLevel?: string,
  grade?: string,
  room?: string
) =>
  useQuery({
    queryKey: [
      KEY,
      "getStudentGroupByTermId",
      academicTerm || "",
      degreeLevel || "",
      grade || "",
      room || "",
    ],
    queryFn: ({ queryKey }) => {
      const [, academicTerm, degreeLevel, grade, room] = queryKey;
      return calendarService
        .getStudentGroupByTermId(academicTerm, { degreeLevel, grade, room })
        .then((res) => res.data.data.result);
    },
    select: (data) =>
      data.reduce(
        (a, b) => {
          return {
            students: [...a.students, ...b.students],
          } as StudentGroup;
        },
        {
          students: [],
        } as unknown as StudentGroup
      ).students,
    initialData: [],
  });
