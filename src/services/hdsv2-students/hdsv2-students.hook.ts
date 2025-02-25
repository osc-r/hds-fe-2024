import { useQuery } from "@tanstack/react-query";
import hdsv2StudentsService from "./hdsv2-students.service";
import { Student } from "./hdsv2-students";

const KEY = "HDSV2_STUDENT_SERVICE";

export const useGetStudentById = (studentId: string) =>
  useQuery<Student>({
    queryKey: [KEY, "getStudentById", studentId],
    queryFn: async () => {
      return await hdsv2StudentsService
        .getStudentById(studentId)
        .then((res) => res.data.data);
    },
  });
