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
