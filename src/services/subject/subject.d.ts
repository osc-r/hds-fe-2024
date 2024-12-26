import { RecordMetadata } from "../type";

export type CreateSubjectDto = {
  curriculum: string;
  code: {
    th: string;
    en: string;
  };
  codeSuffix: string;
  name: {
    th: string;
    en: string;
  };
  shortName: {
    th: string;
    en: string;
  };
  displayNameTranscript: {
    th: string;
    en: string;
  };
  degreeLevel: string;
  subjectAreas: string;
  subjectType: string;
  credit: number;
  hours: number;
  hoursPerWeek: number;
};

export type Subject = CreateSubjectDto & RecordMetadata;

export type SearchSubjectDto = {
  curriculum?: string;
  code?: string;
  name?: string;
  subjectType?: string;
  subjectAreas?: string;
  degreeLevel?: string;
};

export type CreateSubjectOfferedDto = {
  academicTerm: string;
  degreeLevel: string;
  grade: number;
  room: number;
  subject: Subject;
  studentEnrollments: any[];
  studentGradeRecords: any[];
  workflowStatus: any[];
};

export type SubjectOffered = CreateSubjectOfferedDto & RecordMetadata;

export type SearchSubjectOfferedDto = {
  academicTerm?: string;
  "subject.code"?: string;
  "subject.name"?: string;
  "subject.subjectType"?: string;
  degreeLevel?: string;
  grade?: string;
  room?: string;
};
