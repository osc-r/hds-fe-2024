import { FormProvider, useForm } from "react-hook-form";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { CreateRoomDto } from "../../../services/class-scheduler/class-scheduler";
import { moreThan, requiredField } from "../validation";

export type ClassroomFormType = CreateRoomDto;

const FORM_COMPONENTS = (
  disabled: boolean,
  menu1: {
    label: string;
    value: string;
  }[],
  menu2: {
    label: string;
    value: string;
  }[]
): FormComponent<ClassroomFormType>[] => [
  {
    name: "building",
    label: "Classroom Building",
    type: "SELECT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    menu: menu1,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "name",
    label: "Classroom name",
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
    name: "floorNo",
    label: "Floor No.",
    type: "TEXT_INPUT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      moreThan: moreThan(0),
    },
  },
  {
    name: "studyCapacity",
    label: "Number of study seats",
    type: "TEXT_INPUT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      moreThan: moreThan(0),
    },
  },
  {
    name: "examCapacity",
    label: "Number of examination seats",
    type: "TEXT_INPUT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      moreThan: moreThan(0),
    },
  },
  {
    name: "roomType",
    label: "Types of classrooms",
    type: "SELECT",
    disabled: disabled,
    size: 12,
    labelSize: 4,
    inputSize: 7,
    menu: menu2,
    validate: {
      required: requiredField,
    },
  },
];

const ClassroomForm = (
  props: FormProps<ClassroomFormType> & {
    buildingOptions: {
      label: string;
      value: string;
    }[];
    classroomTypeOptions: {
      label: string;
      value: string;
    }[];
  }
) => {
  const methods = useForm<ClassroomFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(
          !!props.initialData,
          props.buildingOptions,
          props.classroomTypeOptions
        )}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default ClassroomForm;
