import Client from "../client";
import { Option } from "../option/option";
import { BaseResponse } from "../type";
import {
  Building,
  CreateBuildingDto,
  CreateRoomDto,
  Room,
} from "./class-scheduler";

class ClassSchedulerService {
  createBuilding(dto: CreateBuildingDto) {
    return Client.instance.post<BaseResponse>(
      `/v1/class-scheduler/building`,
      dto
    );
  }
  getBuilding() {
    return Client.instance.get<
      BaseResponse<{ result: Building[]; totalRecord: number }>
    >(`/v1/class-scheduler/building`);
  }
  getBuildingById(id: string) {
    return Client.instance.get<BaseResponse<Building>>(
      `/v1/class-scheduler/building/${id}`
    );
  }
  updateBuildingById(id: string, dto: CreateBuildingDto) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/building/${id}`,
      dto
    );
  }
  deleteBuildingById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/class-scheduler/building/${id}`
    );
  }
  //
  createRoom(dto: CreateRoomDto) {
    return Client.instance.post<BaseResponse>(`/v1/class-scheduler/room`, dto);
  }
  getRoom() {
    return Client.instance.get<
      BaseResponse<{ result: Room[]; totalRecord: number }>
    >(`/v1/class-scheduler/room`);
  }
  getRoomTypeOption() {
    return Client.instance.get<BaseResponse<Option>>(
      `/v1/class-scheduler/room/options/room-type`
    );
  }
  getRoomById(id: string) {
    return Client.instance.get<BaseResponse<Room>>(
      `/v1/class-scheduler/room/${id}`
    );
  }
  updateRoomById(id: string, dto: CreateRoomDto) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/room/${id}`,
      dto
    );
  }
  deleteRoomById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/class-scheduler/room/${id}`
    );
  }
  //
  createConfig() {
    return Client.instance.post<BaseResponse>(
      `/v1/class-scheduler/schedule/config`
    );
  }
  getConfigs() {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/schedule/config`
    );
  }
  getConfigById(id: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/schedule/config/${id}`
    );
  }
  updateConfigById(id: string) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/schedule/config/${id}`
    );
  }
  deleteConfigById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/class-scheduler/schedule/config/${id}`
    );
  }
  //
  createSchedule() {
    return Client.instance.post<BaseResponse>(`/v1/class-scheduler/schedule`);
  }
  getScheduleActivityOption() {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/schedule/activity/option`
    );
  }
  getScheduleByStudentGroupId() {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/schedule/view/by-student-group`
    );
  }
}

const classSchedulerService = new ClassSchedulerService();
Object.freeze(classSchedulerService);

export default classSchedulerService;
