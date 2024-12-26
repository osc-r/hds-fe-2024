import Client from "../client";
import { BaseResponse } from "../type";

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
}

const hdsv2UsersService = new Hdsv2UsersService();
Object.freeze(hdsv2UsersService);

export default hdsv2UsersService;
