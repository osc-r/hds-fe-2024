export type BaseResponse<T = object> = {
  code: number;
  description: string;
  data: T;
};

export type RecordMetadata = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Locale = { [lang: string]: string };

export type Pagination = {
  sort?: string;
  page?: string;
  limit?: string;
  offset?: string;
};

export type ListResponse<T> = { result: T[]; totalRecord: number };
