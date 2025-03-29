import { useQuery } from "@tanstack/react-query";
import hdsv2UsersService from "./hdsv2-users.service";

const KEY = "HDSV2_USERS_SERVICE";

export const useGetInstructors = () =>
  useQuery({
    queryKey: [KEY, "getInstructors"],
    queryFn: async () => {
      return (await hdsv2UsersService.getInstructors()).data.data;
    },
    initialData: [],
  });
