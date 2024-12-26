export type LoginResponse = {
  name: string;
  surname: string;
  access_token: string;
  access_token_expire: number;
  refresh_token: string;
  refresh_token_expire: number;
};

export type ProfileResponse = {
  name: string;
  surname: string;
  roles: string[];
};

export type RenewTokenResponse = {
  accessToken: string;
  accessTokenExpire: number;
};
