import { FormProvider, useForm } from "react-hook-form";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { CreateNonAcademicActivityDto } from "../../../services/non-academic-activity/non-academic-activity";
import { requiredField } from "../validation";

export type ActivityFormType = CreateNonAcademicActivityDto;

const FORM_COMPONENTS = (
  disabled: boolean,
  menu1: {
    label: string;
    value: string;
  }[]
): FormComponent<ActivityFormType>[] => [
  {
    name: "name.th",
    label: "ชื่อกิจกรรม ภาษาไทย",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "name.en",
    label: "ชื่อกิจกรรม ภาษาอังกฤษ",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "description",
    label: "คำอธิบาย",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 4,
    inputSize: 7,
  },
  {
    name: "academicTerm",
    label: "ภาคเรียน",
    type: "SELECT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    menu: menu1,
  },
];

const ActivityForm = (
  props: FormProps<ActivityFormType> & {
    termOptions: {
      label: string;
      value: string;
    }[];
  }
) => {
  const methods = useForm<ActivityFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(!!props.initialData, props.termOptions)}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default ActivityForm;
