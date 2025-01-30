import Client from "../client";
import { BaseResponse } from "../type";
import { GroupOption } from "./hdsv2-groups";

class Hdsv2GroupsService {
  getGroups() {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-groups`);
  }
  getGroupsOption(format: string, dto?: unknown) {
    return Client.instance.get<
      BaseResponse<{ result: GroupOption[]; totalRecord: number }>
    >(`/v1/hdsv2-groups/option/${format}`, { params: dto });
  }
}

const hdsv2GroupsService = new Hdsv2GroupsService();
Object.freeze(hdsv2GroupsService);

export default hdsv2GroupsService;
