import { ActivityFormType } from "@/components/forms/activity/ActivityForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import nonAcademicActivityService from "./non-academic-activity.service";
import { NonAcademicActivity } from "./non-academic-activity";

const KEY = "NON_ACADEMIC_ACTIVITY_SERVICE";

export const useCreateNonAcademicActivity = (onSuccess: () => void) =>
  useMutation<unknown, unknown, ActivityFormType>({
    mutationFn: async (body) => {
      return (await nonAcademicActivityService.createNonAcademicActivity(body))
        .data;
    },
    onSuccess,
  });

export const useUpdateNonAcademicActivityById = (
  id: string,
  onSuccess: () => void
) =>
  useMutation<unknown, unknown, ActivityFormType>({
    mutationFn: async (body) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { academicTerm, ..._body } = body;
      return (
        await nonAcademicActivityService.updateNonAcademicActivityById(
          id,
          _body
        )
      ).data;
    },
    onSuccess,
  });

export const useGetNonAcademicActivityById = (id: string) =>
  useQuery<unknown, unknown, ActivityFormType>({
    queryKey: [KEY, `getNonAcademicActivityById`, id],
    queryFn: () =>
      nonAcademicActivityService
        .getNonAcademicActivityById(id as string)
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, __v, createdAt, updatedAt, ...rest } = res.data.data;
          return rest;
        }),
  });

export const useDeleteNonAcademicActivityById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (
        await nonAcademicActivityService.deleteNonAcademicActivityById(id)
      ).data;
    },
    onSuccess,
  });

export const useGetNonAcademicActivities = (academicTerm: string) =>
  useQuery<unknown, unknown, NonAcademicActivity[], string[]>({
    queryKey: [KEY, "getNonAcademicActivities", academicTerm],
    queryFn: ({ queryKey }) => {
      const [, , academicTerm] = queryKey;
      return nonAcademicActivityService
        .getNonAcademicActivities({ academicTerm: academicTerm || undefined })
        .then((res) => res.data.data.result);
    },
    initialData: [],
    enabled: false,
  });
