import { FormProvider, useForm } from "react-hook-form";
import { CreateHolidayDto } from "../../../services/calendar/calendar";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { requiredField } from "../validation";

export type HolidayFormType = CreateHolidayDto;

const FORM_COMPONENTS: FormComponent<HolidayFormType>[] = [
  {
    name: "name.th",
    label: "ชื่อวันหยุด (ไทย)",
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
    name: "name.en",
    label: "ชื่อวันหยุด (อังกฤษ)",
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
    name: "date",
    label: "วันที่",
    type: "DATE_PICKER",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
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

const HolidayForm = (props: FormProps<HolidayFormType>) => {
  const methods = useForm<HolidayFormType>();

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

export default HolidayForm;
