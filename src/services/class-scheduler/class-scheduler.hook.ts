import { useMutation, useQuery } from "@tanstack/react-query";
import classSchedulerService from "./class-scheduler.service";
import { ClassroomFormType } from "@/components/forms/classroom/ClassroomForm";
import { ClassroomBuildingFormType } from "@/components/forms/classroom-building/ClassroomBuildingForm";
import { Building } from "./class-scheduler";

const KEY = "CLASS_SCHEDULER_SERVICE";

export const useGetRooms = () =>
  useQuery({
    queryKey: [KEY, "getRoom"],
    queryFn: () => {
      return classSchedulerService
        .getRoom()
        .then((res) => res.data.data.result);
    },
    initialData: [],
  });

export const useGetRoomById = (id: string) =>
  useQuery<unknown, unknown, ClassroomFormType>({
    queryKey: [KEY, "getRoomById", id],
    queryFn: () =>
      classSchedulerService.getRoomById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, kind, ...rest } = res.data.data;
        return rest;
      }),
  });

export const useDeleteRoomById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await classSchedulerService.deleteRoomById(id)).data;
    },
    onSuccess,
  });

export const useUpdateRoomById = (id: string, onSuccess: () => void) =>
  useMutation<unknown, unknown, ClassroomFormType>({
    mutationFn: async (body) => {
      return (await classSchedulerService.updateRoomById(id, body)).data;
    },
    onSuccess,
  });

export const useCreateRoom = (onSuccess: () => void) =>
  useMutation<unknown, unknown, ClassroomFormType>({
    mutationFn: async (body) => {
      return (await classSchedulerService.createRoom(body)).data;
    },
    onSuccess,
  });

export const useGetRoomTypeOption = (lang: string) =>
  useQuery({
    queryKey: [KEY, "getRoomTypeOption"],
    queryFn: () => {
      return classSchedulerService
        .getRoomTypeOption()
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

/** */
export const useCreateBuilding = (onSuccess: () => void) =>
  useMutation<unknown, unknown, ClassroomBuildingFormType>({
    mutationFn: async (body) => {
      return (await classSchedulerService.createBuilding(body)).data;
    },
    onSuccess,
  });

export const useGetBuilding = (selectFn?: (data: Building[]) => any) =>
  useQuery({
    queryKey: [KEY, "getBuilding"],
    queryFn: async () => {
      return (await classSchedulerService.getBuilding()).data.data.result;
    },
    select: (data) => {
      if (selectFn) {
        return selectFn(data);
      }
      return data;
    },
    initialData: [],
  });

export const useGetBuildingById = (id: string) =>
  useQuery({
    queryKey: [KEY, `getBuildingById`, id],
    queryFn: () =>
      classSchedulerService.getBuildingById(id as string).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, kind, ...rest } = res.data.data;
        return rest;
      }),
  });

export const useDeleteBuildingById = (onSuccess: () => void) =>
  useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      return (await classSchedulerService.deleteBuildingById(id)).data;
    },
    onSuccess,
  });

export const useUpdateBuildingById = (id: string, onSuccess: () => void) =>
  useMutation<unknown, unknown, ClassroomBuildingFormType>({
    mutationFn: async (body) => {
      return (
        await classSchedulerService.updateBuildingById(id as string, body)
      ).data;
    },
    onSuccess,
  });
