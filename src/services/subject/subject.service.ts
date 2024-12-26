import Client from "../client";
import { Option } from "../option/option";
import { BaseResponse } from "../type";
import {
  CreateSubjectDto,
  SearchSubjectDto,
  SearchSubjectOfferedDto,
  Subject,
  SubjectOffered,
} from "./subject";

class SubjectService {
  getCoreCurriculumOptions() {
    return Client.instance.get<BaseResponse<Option>>(
      `/v1/subject/option/core-curriculum`
    );
  }
  getSubjectAreaOptions() {
    return Client.instance.get<BaseResponse<Option>>(
      `/v1/subject/option/subject-area`
    );
  }
  getSubjectTypeOptions() {
    return Client.instance.get<BaseResponse<Option>>(
      `/v1/subject/option/subject-type`
    );
  }
  createSubjectOffered() {
    return Client.instance.post<BaseResponse>(`/v1/subject/offered`);
  }
  getSubjectOffered(dto?: SearchSubjectOfferedDto) {
    return Client.instance.get<
      BaseResponse<{ result: SubjectOffered[]; totalRecord: number }>
    >(`/v1/subject/offered`, { params: dto });
  }
  groupEnroll() {
    return Client.instance.post<BaseResponse>(`/v1/subject/enroll/group`);
  }
  groupWithdraw() {
    return Client.instance.post<BaseResponse>(`/v1/subject/withdraw/group`);
  }
  individualEnroll() {
    return Client.instance.post<BaseResponse>(`/v1/subject/enroll/individual`);
  }
  getEnrollmentByGroup() {
    return Client.instance.get<BaseResponse>(
      `/v1/subject/offered/enrollment-by-group`
    );
  }
  getEnrollmentByStudentId(studentId: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/subject/offered/enrollment-by-student/${studentId}`
    );
  }
  getOfferedById(id: string) {
    return Client.instance.get<BaseResponse>(`/v1/subject/offered/${id}`);
  }
  updateOfferedById(id: string) {
    return Client.instance.put<BaseResponse>(`/v1/subject/offered/${id}`);
  }
  deleteOfferedById(id: string) {
    return Client.instance.delete<BaseResponse>(`/v1/subject/offered/${id}`);
  }
  createSubject(dto: CreateSubjectDto) {
    return Client.instance.post<BaseResponse>(`/v1/subject`, dto);
  }
  getSubjects(dto?: SearchSubjectDto) {
    return Client.instance.get<
      BaseResponse<{ result: Subject[]; totalRecord: number }>
    >(`/v1/subject`, { params: dto });
  }
  getSubjectById(id: string) {
    return Client.instance.get<BaseResponse<Subject>>(`/v1/subject/${id}`);
  }
  updateSubjectById(id: string, dto: CreateSubjectDto) {
    return Client.instance.patch<BaseResponse>(`/v1/subject/${id}`, dto);
  }
  deleteSubjectById(id: string) {
    return Client.instance.delete<BaseResponse>(`/v1/subject/${id}`);
  }
}

const subjectService = new SubjectService();
Object.freeze(subjectService);

export default subjectService;
