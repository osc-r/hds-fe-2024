import { RecordMetadata } from "../type";

export type Building = {
  name: string;
  kind: "Building";
  totalFloor: number;
} & RecordMetadata;

export type CreateBuildingDto = {
  name: string;
  totalFloor: number;
};

export type Room = {
  name: string;
  kind: "Room";
  building: Building;
  floorNo: number;
  roomType: "CLASSROOM";
  studyCapacity: number;
  examCapacity: number;
} & RecordMetadata;

export type CreateRoomDto = {
  name: string;
  building: string;
  floorNo: number;
  roomType: string;
  studyCapacity: number;
  examCapacity: number;
};
export type TimeSlot = {
  startAt: {
    h: number;
    m: number;
  };
  endAt: {
    h: number;
    m: number;
  };
};

export type CreateStudyPeriodDto = {
  name: string;
  isStudyOnWeekend: boolean;
  academicTerm: string;
  timeSlot: TimeSlot[];
};

export type StudyPeriod = CreateStudyPeriodDto & RecordMetadata;

export type GetScheduleDto = {
  academicTerm: string;
  studentGroupId?: string;
  isoWeekday?: string;
};

export type ActivityOption = {
  th: string;
  en: string;
  referenceModel: string;
  _id: string;
};

export type Period = {
  referenceModel: string;
  referenceId: string;
  instructors: { userId: string }[];
  buildingRoom: string;
  isCombinedClass: boolean;
};

export type CreateScheduleDto = {
  studentGroup: string;
  periodConfig: string;
  isoWeekday: number;
  periodAssignments: Period[];
};

export type ViewScheduleResponse = {
  periodConfig: { _id: string; name: string; timeSlot: TimeSlot[] }[];
  timetable: {
    studentGroup: {
      id: string;
      academicTerm: string;
      degreeLevel: string;
      grade: number;
      room: number;
    };
    isoWeekday: number;
    periodAssignments: {
      id: string;
      referenceModel: string;
      referenceId: string;
      instructors: {
        role: string;
        userId: string;
      }[];
      buildingRoom: string;
      isCombinedClass: boolean;
      periodConfig: {
        id: string;
        refIndex: number;
      };
      name: {
        th: string;
        en: string;
      };
    }[];
  }[];
};
