import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { CreateAcademicCalendarDto } from "../../../services/calendar/calendar";
import { FormProvider, useForm } from "react-hook-form";

export type AcademicCalendarFormType = CreateAcademicCalendarDto & {
  finalTermStartDate?: null | string;
  finalTermEndDate?: null | string;
  indicator?: null | string;
};

const FORM_COMPONENTS: FormComponent<AcademicCalendarFormType>[] = [
  {
    name: "academicYear",
    label: "ปีการศึกษา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    htmlInputType: "number",
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "term",
    label: "ภาคเรียน",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    htmlInputType: "number",
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "openingDate",
    label: "วันที่เปิดภาคเรียน",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "endingDate",
    label: "วันที่ปิดภาคเรียน",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "midtermStartDate",
    label: "วันที่เริ่มสอบกลางภาค",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  {
    name: "midtermEndDate",
    label: "ถึงวันที่",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  {
    name: "finalTermStartDate",
    label: "วันที่เริ่มสอบปลายภาค",
    type: "DATE_PICKER",
    disabled: true,
    size: 6,
  },
  {
    name: "finalTermEndDate",
    label: "ถึงวันที่",
    type: "DATE_PICKER",
    disabled: true,
    size: 6,
  },
  {
    name: "gradeSubmittingStartDate",
    label: "วันที่ผู้สอนส่งผลการเรียนผ่านระบบ",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  {
    name: "gradeSubmittingEndDate",
    label: "ถึงวันที่",
    type: "DATE_PICKER",
    disabled: false,
    size: 6,
  },
  {
    name: "indicator",
    label: "จำนวนตัวชี้วัดคุณลักษณะอันพึงประสงค์",
    type: "TEXT_INPUT",
    disabled: true,
    size: 6,
  },
];

const AcademicCalendarForm = (props: FormProps<AcademicCalendarFormType>) => {
  const methods = useForm<AcademicCalendarFormType>();

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

export default AcademicCalendarForm;
