import { SubmitHandler } from "react-hook-form";

export type FormProps<T> = {
  onSubmit: SubmitHandler<T>;
  initialData?: T;
  isLoading?: boolean;
};

export type Menu = {
  label: string;
  value: string;
  [key: string]: Record<string, string> | string | Map;
}[];
