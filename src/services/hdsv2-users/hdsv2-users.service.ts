import Client from "../client";
import { BaseResponse } from "../type";
import { Instructor } from "./hdsv2-users";

class Hdsv2UsersService {
  getUsers() {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-users`);
  }
  createUser() {
    return Client.instance.post<BaseResponse>(`/v1/hdsv2-users`);
  }
  getProfile() {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-users/me`);
  }
  getUserById(id: string) {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-users/${id}`);
  }
  getInstructors() {
    return Client.instance.get<BaseResponse<Instructor[]>>(
      `/v1/hdsv2-users/role/instructors`
    );
  }
}

const hdsv2UsersService = new Hdsv2UsersService();
Object.freeze(hdsv2UsersService);

export default hdsv2UsersService;
