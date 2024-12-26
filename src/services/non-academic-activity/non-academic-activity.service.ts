import Client from "../client";
import { BaseResponse } from "../type";

class NonAcademicActivityService {
  createNonAcademicActivity() {
    return Client.instance.post<BaseResponse>(`/v1/non-academic-activity`);
  }
  getNonAcademicActivities() {
    return Client.instance.get<BaseResponse>(`/v1/non-academic-activity`);
  }
  getNonAcademicActivityById(id: string) {
    return Client.instance.get<BaseResponse>(`/v1/non-academic-activity/${id}`);
  }
  updateNonAcademicActivityById(id: string) {
    return Client.instance.patch<BaseResponse>(
      `/v1/non-academic-activity/${id}`
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
