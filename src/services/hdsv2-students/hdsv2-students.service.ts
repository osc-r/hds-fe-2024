import Client from "../client";
import { BaseResponse } from "../type";

class Hdsv2StudentsService {
  getStudents() {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-students`);
  }
  getStudentById(id: string) {
    return Client.instance.get<BaseResponse>(`/v1/hdsv2-students/${id}/detail`);
  }
  inquiryStudents() {
    return Client.instance.post<BaseResponse>(`/v1/hdsv2-students/inquiry`);
  }
}

const hdsv2StudentsService = new Hdsv2StudentsService();
Object.freeze(hdsv2StudentsService);

export default hdsv2StudentsService;
