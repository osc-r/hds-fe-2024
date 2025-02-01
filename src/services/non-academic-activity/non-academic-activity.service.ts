import Client from "../client";
import { BaseResponse } from "../type";
import {
  CreateNonAcademicActivityDto,
  NonAcademicActivity,
  SearchNonAcademicActivityDto,
} from "./non-academic-activity";

class NonAcademicActivityService {
  createNonAcademicActivity(dto: CreateNonAcademicActivityDto) {
    return Client.instance.post<BaseResponse>(`/v1/non-academic-activity`, dto);
  }
  getNonAcademicActivities(dto?: SearchNonAcademicActivityDto) {
    return Client.instance.get<
      BaseResponse<{ result: NonAcademicActivity[]; totalRecord: number }>
    >(`/v1/non-academic-activity`, {
      params: { ...dto, includeNoAcademicTerm: 1 },
    });
  }
  getNonAcademicActivityById(id: string) {
    return Client.instance.get<BaseResponse<NonAcademicActivity>>(
      `/v1/non-academic-activity/${id}`
    );
  }
  updateNonAcademicActivityById(
    id: string,
    dto: Omit<CreateNonAcademicActivityDto, "academicTerm">
  ) {
    return Client.instance.patch<BaseResponse>(
      `/v1/non-academic-activity/${id}`,
      dto
    );
  }
  deleteNonAcademicActivityById(id: string) {
    return Client.instance.delete<BaseResponse>(
      `/v1/non-academic-activity/${id}`
    );
  }
}

const nonAcademicActivityService = new NonAcademicActivityService();
Object.freeze(nonAcademicActivityService);

export default nonAcademicActivityService;
