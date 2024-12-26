import Client from "../client";
import { BaseResponse } from "../type";

class ClassSchedulerService {
  createBuilding() {
    return Client.instance.post<BaseResponse>(`/v1/class-scheduler/building`);
  }
  getBuilding() {
    return Client.instance.get<BaseResponse>(`/v1/class-scheduler/building`);
  }
  getBuildingById(id: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/building/${id}`
    );
  }
  updateBuildingById(id: string) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/building/${id}`
    );
  }
  deleteBuildingById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/class-scheduler/building/${id}`
    );
  }
  //
  createRoom() {
    return Client.instance.post<BaseResponse>(`/v1/class-scheduler/room`);
  }
  getRoom() {
    return Client.instance.get<BaseResponse>(`/v1/class-scheduler/room`);
  }
  getRoomTypeOption() {
    return Client.instance.get<BaseResponse>(
      `/v1/class-scheduler/room/options/room-type`
    );
  }
  getRoomById(id: string) {
    return Client.instance.get<BaseResponse>(`/v1/class-scheduler/room/${id}`);
  }
  updateRoomById(id: string) {
    return Client.instance.patch<BaseResponse>(
      `/v1/class-scheduler/room/${id}`
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
