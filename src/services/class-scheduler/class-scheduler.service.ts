import Client from "../client";
import { Option } from "../option/option";
import { BaseResponse, ListResponse } from "../type";
import {
  ActivityOption,
  Building,
  CreateBuildingDto,
  CreateRoomDto,
  CreateScheduleDto,
  CreateStudyPeriodDto,
  GetScheduleDto,
  Room,
  StudyPeriod,
  ViewScheduleResponse,
} from "./class-scheduler";

class ClassSchedulerService {
  createBuilding(dto: CreateBuildingDto) {
    return Client.instance.post<BaseResponse>(
      `/v1/class-scheduler/building`,
      dto
    );
  }
  getBuilding() {
    return Client.instance.get<BaseResponse<ListResponse<Building>>>(
      `/v1/class-scheduler/building`
    );
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
    return Client.instance.get<BaseResponse<ListResponse<Room>>>(
      `/v1/class-scheduler/room`
    );
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
  createConfig(dto: CreateStudyPeriodDto) {
    return Client.instance.post<BaseResponse>(
      `/v1/class-scheduler/schedule/config`,
      dto
    );
  }
  getConfigs(academicTerm: string) {
    return Client.instance.get<BaseResponse<ListResponse<StudyPeriod>>>(
      `/v1/class-scheduler/schedule/config`,
      { params: { academicTerm } }
    );
  }
  getConfigById(id: string) {
    return Client.instance.get<BaseResponse<StudyPeriod>>(
      `/v1/class-scheduler/schedule/config/${id}`
    );
  }
  updateConfigById(
    id: string,
    dto: Omit<CreateStudyPeriodDto, "name" | "academicTerm">
  ) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/schedule/config/${id}`,
      dto
    );
  }
  deleteConfigById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/class-scheduler/schedule/config/${id}`
    );
  }
  //
  createSchedule(dto: CreateScheduleDto) {
    return Client.instance.post<BaseResponse>(
      `/v1/class-scheduler/schedule`,
      dto
    );
  }
  getScheduleActivityOption(academicTerm: string) {
    return Client.instance.get<BaseResponse<ListResponse<ActivityOption>>>(
      `/v1/class-scheduler/schedule/activity/options`,
      { params: { academicTerm } }
    );
  }
  getScheduleByStudentGroupId(dto: GetScheduleDto) {
    return Client.instance.get<BaseResponse<ViewScheduleResponse>>(
      `/v1/class-scheduler/schedule/view/by-student-group`,
      { params: dto }
    );
  }
}

const classSchedulerService = new ClassSchedulerService();
Object.freeze(classSchedulerService);

export default classSchedulerService;
