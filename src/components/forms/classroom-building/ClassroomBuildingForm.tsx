import { FormProvider, useForm } from "react-hook-form";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { CreateBuildingDto } from "../../../services/class-scheduler/class-scheduler";
import { moreThan, requiredField } from "../validation";

export type ClassroomBuildingFormType = CreateBuildingDto;

const FORM_COMPONENTS = (
  disabled: boolean
): FormComponent<ClassroomBuildingFormType>[] => [
  {
    name: "name",
    label: "Building Name",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "totalFloor",
    label: "Number of layers",
    type: "TEXT_INPUT",
    disabled: disabled,
    size: 12,
    labelSize: 3,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      moreThan: moreThan(0) as any,
    },
  },
];

const ClassroomBuildingForm = (props: FormProps<ClassroomBuildingFormType>) => {
  const methods = useForm<ClassroomBuildingFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(!!props.initialData)}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default ClassroomBuildingForm;
