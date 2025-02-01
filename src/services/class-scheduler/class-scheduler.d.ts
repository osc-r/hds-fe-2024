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
