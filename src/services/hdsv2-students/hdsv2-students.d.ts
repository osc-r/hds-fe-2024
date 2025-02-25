import { Locale, RecordMetadata } from "../type";

export type Student = {
  idx: string;
  code: string;
  program: string;
  prefix: Locale;
  firstName: Locale;
  middleName: Locale;
  lastName: Locale;
  nickname: Locale;
  email: string;
  attendedDate: string;
  status: string;
  currentZipCode: string;
  currentProvince: string;
  currentDistrict: string;
  currentSubDistrict: string;
  currentMoo: string;
  currentStreet: string;
  currentSoi: string;
  currentHouseNo: string;
  name: string;
  level: Locale & {
    id: "";
  };
  grade: string;
  room: string;
  degreeLevel: string;
  image: string;
  phoneNumber: string;
} & RecordMetadata;
