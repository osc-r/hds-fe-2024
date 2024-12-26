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
