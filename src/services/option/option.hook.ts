import { useQuery } from "@tanstack/react-query";
import optionService from "./option.service";
import { Option } from "./option";

const KEY = "OPTION_SERVICE";

export const useGetDegreeOptions = (lang: string) =>
  useQuery<Option, unknown, { label: string; value: string }[]>({
    queryKey: [KEY, "getDegreeOptions"],
    queryFn: () => {
      return optionService.getDegreeOptions().then((res) => res.data.data);
    },
    select: (data) => {
      const output: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(data)) {
        output.push({ label: value[lang], value: key });
      }
      return output;
    },
    initialData: {},
  });
