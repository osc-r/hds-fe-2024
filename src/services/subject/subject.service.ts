import Client from "../client";
import { Option } from "../option/option";
import { BaseResponse, ListResponse } from "../type";
import {
  CreateSubjectDto,
  CreateSubjectOfferedDto,
  EnrollmentByGroup,
  GroupEnrollDto,
  IndividualEnrollDto,
  SearchEnrollmentByGroupDto,
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
  createSubjectOffered(dto: CreateSubjectOfferedDto) {
    return Client.instance.post<BaseResponse>(`/v1/subject/offered`, dto);
  }
  getSubjectOffered(dto?: SearchSubjectOfferedDto) {
    return Client.instance.get<BaseResponse<ListResponse<SubjectOffered>>>(
      `/v1/subject/offered`,
      { params: dto }
    );
  }
  getSubjectOfferedById(id: string) {
    return Client.instance.get<BaseResponse<SubjectOffered>>(
      `/v1/subject/offered/${id}`
    );
  }
  groupEnroll(dto: GroupEnrollDto) {
    return Client.instance.post<BaseResponse>(`/v1/subject/enroll/group`, dto);
  }
  groupWithdraw() {
    return Client.instance.post<BaseResponse>(`/v1/subject/withdraw/group`);
  }
  individualEnroll(dto: IndividualEnrollDto) {
    return Client.instance.post<BaseResponse>(
      `/v1/subject/enroll/individual`,
      dto
    );
  }
  getEnrollmentByGroup(dto: SearchEnrollmentByGroupDto) {
    return Client.instance.get<BaseResponse<EnrollmentByGroup[]>>(
      `/v1/subject/offered/enrollment-by-group`,
      { params: dto }
    );
  }
  getEnrollmentByStudentId(studentId: string, academicTermId: string) {
    return Client.instance.get<BaseResponse>(
      `/v1/subject/offered/enrollment-by-student/${studentId}`,
      { params: { academicTermId } }
    );
  }
  getOfferedById(id: string) {
    return Client.instance.get<BaseResponse<SubjectOffered>>(
      `/v1/subject/offered/${id}`
    );
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
    return Client.instance.get<BaseResponse<ListResponse<Subject>>>(
      `/v1/subject`,
      { params: dto }
    );
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
