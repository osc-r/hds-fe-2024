import { CreateSubjectDto } from "../../../services/subject/subject";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, useForm } from "react-hook-form";
import { RequiredOptions } from "./type";

export type CurriculumSubjectOfferedFormType = CreateSubjectDto;

const FORM_COMPONENTS = (
  menu1: Menu,
  menu2: Menu
): FormComponent<CurriculumSubjectOfferedFormType>[] => [
  {
    name: "curriculum",
    label: "ภาคเรียน",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 9.5,
    menu: menu1,
  },
  {
    name: "curriculum",
    label: "ชั้นเรียน",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 9.5,
    menu: menu2,
  },
  {
    name: "curriculum",
    label: "รหัสวิชา",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 9.5,
    menu: menu1,
  },
];

const CurriculumSubjectOfferedForm = (
  props: FormProps<CurriculumSubjectOfferedFormType> & RequiredOptions
) => {
  const methods = useForm<CurriculumSubjectOfferedFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(
          props.academicTermOptions,
          props.classOptions
        )}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default CurriculumSubjectOfferedForm;
