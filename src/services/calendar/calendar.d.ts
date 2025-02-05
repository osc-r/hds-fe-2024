import { RecordMetadata } from "../type";

export type CreateAcademicCalendarDto = {
  academicYear: number;
  term: number;
  openingDate: string;
  endingDate: string;
  midtermStartDate: null | string;
  midtermEndDate: null | string;
  gradeSubmittingStartDate: null | string;
  gradeSubmittingEndDate: null | string;
};

export type Term = CreateAcademicCalendarDto & RecordMetadata;

export type CreateHolidayDto = {
  name: {
    th: string;
    en: string;
  };
  date: string;
  havingOnlineClass: boolean;
};

export type Holiday = CreateHolidayDto & RecordMetadata;

export type SearchHolidayDto = {
  academicYear?: string;
  month?: string;
};

export type TermOption = { [key: string]: Record<string, string> };

export type Student = {
  _id: string;
  idx: string;
  code: string;
  program: string;
  prefix: {
    th: string;
    en: string;
  };
  firstName: {
    th: string;
    en: string;
  };
  middleName: {
    th: string;
    en: string;
  };
  lastName: {
    th: string;
    en: string;
  };
  nickname: {
    th: string;
    en: string;
  };
  email: string;
  attendedDate: string;
  status: string;
};

export type StudentGroup = {
  academicTerm: string;
  degreeLevel: string;
  grade: number;
  room: number;
  students: Student[];
  th: string;
  en: string;
  studentsCount: number;
} & RecordMetadata;

export type SearchStudentGroupByTermIdDto = {
  degreeLevel: string;
  grade: string;
  room: string;
};
