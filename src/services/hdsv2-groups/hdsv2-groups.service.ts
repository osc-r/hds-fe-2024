import Client from "../client";
import { BaseResponse } from "../type";

class Hdsv2GroupsService {
  getGroups() {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-groups`);
  }
  getGroupsOption(format: string, dto?: any) {
    return Client.instance.get<BaseResponse>(
      `/v1/hdsv2-groups/option/${format}`,
      { params: dto }
    );
  }
}

const hdsv2GroupsService = new Hdsv2GroupsService();
Object.freeze(hdsv2GroupsService);

export default hdsv2GroupsService;
