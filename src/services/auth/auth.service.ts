import Client from "../client";
import { BaseResponse } from "../type";
import { LoginResponse, ProfileResponse, RenewTokenResponse } from "./auth";

class AuthService {
  login(email: string, password: string) {
    return Client.instance.post<BaseResponse<LoginResponse>>("/v2/auth/login", {
      email,
      password,
    });
  }
  logout() {
    return Client.instance.get<BaseResponse>("/v1/auth/logout");
  }
  profile() {
    return Client.instance.get<BaseResponse<ProfileResponse>>("/v2/auth/me");
  }
  renewToken() {
    return Client.instance.post<BaseResponse<RenewTokenResponse>>(
      "/v2/auth/refresh"
    );
  }
}

const authService = new AuthService();
Object.freeze(authService);

export default authService;
