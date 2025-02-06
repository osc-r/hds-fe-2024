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

export type Locale = Record<[lang: string], string>;

export type Pagination = {
  sort?: string;
  page?: number;
  limit?: number;
  offset?: number;
};

export type ListResponse<T> = { result: T[]; totalRecord: number };
