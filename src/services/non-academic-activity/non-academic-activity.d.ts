import { RecordMetadata } from "../type";

export type NonAcademicActivity = {
  name: {
    th: string;
    en: string;
  };
  description: string;
  academicTerm: string;
} & RecordMetadata;

export type CreateNonAcademicActivityDto = {
  name: {
    th: string;
    en: string;
  };
  description: string;
  academicTerm: string;
};

export type SearchNonAcademicActivityDto = {
  academicTerm?: string;
};
