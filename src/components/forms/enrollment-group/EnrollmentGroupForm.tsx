import { FormProvider, useForm } from "react-hook-form";
import { CreateHolidayDto } from "../../../services/calendar/calendar";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";

export type EnrollmentGroupFormType = CreateHolidayDto;

const FORM_COMPONENTS: FormComponent<EnrollmentGroupFormType>[] = [
  {
    name: "name.th",
    label: "ชื่อวันหยุด (ไทย)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
  },
  {
    name: "name.en",
    label: "ชื่อวันหยุด (อังกฤษ)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
  },
  {
    name: "date",
    label: "วันที่",
    type: "DATE_PICKER",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
  },
  {
    name: "havingOnlineClass",
    label: "โรงเรียนหยุดเรียน แต่ยังมีการเรียนการสอนออนไลน์",
    type: "CHECKBOX",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
  },
];

const EnrollmentGroupForm = (props: FormProps<EnrollmentGroupFormType>) => {
  const methods = useForm<EnrollmentGroupFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default EnrollmentGroupForm;
