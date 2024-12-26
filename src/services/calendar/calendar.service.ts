import Client from "../client";
import { BaseResponse } from "../type";
import {
  CreateAcademicCalendarDto,
  CreateHolidayDto,
  Holiday,
  SearchHolidayDto,
  Term,
} from "./calendar";

class CalendarService {
  createHolidays(dto: CreateHolidayDto) {
    return Client.instance.post<BaseResponse>(`/v1/calendar/holidays`, {
      holidays: [dto],
    });
  }
  getHolidays(dto?: SearchHolidayDto) {
    return Client.instance.get<
      BaseResponse<{ result: Holiday[]; totalRecord: number }>
    >(`/v1/calendar/holidays`, { params: dto });
  }
  getHolidayById(id: string) {
    return Client.instance.get<BaseResponse<Holiday>>(
      `/v1/calendar/holidays/${id}`
    );
  }
  updateHolidayById(id: string, dto: CreateHolidayDto) {
    return Client.instance.patch<BaseResponse>(
      `/v1/calendar/holidays/${id}`,
      dto
    );
  }
  deleteHolidayById(id: string) {
    return Client.instance.delete<BaseResponse<boolean>>(
      `/v1/calendar/holidays/${id}`
    );
  }
  //
  createTerm(dto: CreateAcademicCalendarDto) {
    type id = string;
    return Client.instance.post<BaseResponse<id>>(`/v1/calendar/term`, dto);
  }
  getTerms() {
    return Client.instance.get<
      BaseResponse<{ result: Term[]; totalRecord: number }>
    >(`/v1/calendar/term`);
  }
  getTermOptions() {
    return Client.instance.get<BaseResponse>(`/v1/calendar/term/options`);
  }
  getTermById(id: string) {
    return Client.instance.get<BaseResponse<Term>>(`/v1/calendar/term/${id}`);
  }
  updateTermById(id: string, dto: CreateAcademicCalendarDto) {
    return Client.instance.patch<BaseResponse>(`/v1/calendar/term/${id}`, dto);
  }
  deleteTermById(id: string) {
    return Client.instance.delete<BaseResponse<boolean>>(
      `/v1/calendar/term/${id}`
    );
  }
  //
  getStudentGroupByTermId(termId: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/calendar/term/${termId}/student-group`
    );
  }
  createStudentGroupByTermId(termId: string) {
    return Client.instance.post<BaseResponse>(
      `/v1/calendar/term/${termId}/student-group`
    );
  }
  getStudentGroupOptionByTermId(termId: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/calendar/term/${termId}/student-group/option`
    );
  }
  updateStudentGroupById(termId: string, groupId: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/calendar/term/${termId}/student-group/${groupId}`
    );
  }
}

const calendarService = new CalendarService();
Object.freeze(calendarService);

export default calendarService;
