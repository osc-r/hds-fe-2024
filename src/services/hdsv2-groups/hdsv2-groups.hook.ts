import { useQuery } from "@tanstack/react-query";
import { GroupOption } from "./hdsv2-groups";
import hdsv2GroupsService from "./hdsv2-groups.service";

const KEY = "HDSV2_GROUP_SERVICE";

export const useGetGroupOption = (lang: "th" | "en", degreeLevel?: string) =>
  useQuery<
    GroupOption[],
    unknown,
    {
      label: string;
      value: string;
      data: {
        degreeLevel: string;
        grade: string;
        room: string;
      };
    }[]
  >({
    queryKey: [KEY, "getGroupsOption", degreeLevel],
    queryFn: (ctx) => {
      return hdsv2GroupsService
        .getGroupsOption("full", { degreeLevel: ctx.queryKey[2] || undefined })
        .then((res) => res.data.data.result);
    },
    select: (data) => {
      const output: {
        label: string;
        value: string;
        data: {
          degreeLevel: string;
          grade: string;
          room: string;
        };
      }[] = [];
      data.forEach((item) => {
        output.push({
          label: item[lang],
          value: item.queryString,
          data: item.query,
        });
      });
      return output;
    },
    initialData: [],
  });
