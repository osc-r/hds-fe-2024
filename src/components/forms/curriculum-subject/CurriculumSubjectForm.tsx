import { CreateSubjectDto } from "../../../services/subject/subject";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, useForm } from "react-hook-form";
import { RequiredOptions } from "./type";
import { moreThan, requiredField } from "../validation";

export type CurriculumSubjectFormType = CreateSubjectDto;

const FORM_COMPONENTS = (
  menu1: Menu,
  menu2: Menu,
  menu3: Menu,
  menu4: Menu
): FormComponent<CurriculumSubjectFormType>[] => [
  {
    name: "curriculum",
    label: "หลักสูตร",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 9.5,
    menu: menu1,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "codeSuffix",
    label: "รหัสต่อท้าย",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "code.th",
    label: "รหัสวิชา(ไทย)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "code.en",
    label: "รหัสวิชา(อังกฤษ)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "name.th",
    label: "ชื่อวิชา(ไทย)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "name.en",
    label: "ชื่อวิชา(อังกฤษ)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "displayNameTranscript.th",
    label: "ชื่อวิชาสำหรับพิมพ์ ปพ. (ไทย)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "displayNameTranscript.en",
    label: "ชื่อวิชาสำหรับพิมพ์ ปพ. (อังกฤษ)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "shortName.th",
    label: "ชื่อย่อ(ไทย)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "shortName.en",
    label: "ชื่อย่อ(อังกฤษ)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "credit",
    label: "หน่วยกิต",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      moreThan: moreThan(0) as any,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "degreeLevel",
    label: "ระดับการศึกษา",
    type: "SELECT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    menu: menu2,
    validate: {
      required: requiredField,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "subjectType",
    label: "ประเภทวิชา",
    type: "SELECT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    menu: menu3,
    validate: {
      required: requiredField,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "subjectAreas",
    label: "กลุ่มสาระการเรียนรู้",
    type: "SELECT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    menu: menu4,
    validate: {
      required: requiredField,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "hours",
    label: "จำนวนชั่วโมง(เต็ม)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      moreThan: moreThan(0) as any,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "hoursPerWeek",
    label: "จำนวนชั่วโมง(ต่อสัปดาห์)",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 5,
    inputSize: 7,
    htmlInputType: "number",
    validate: {
      required: requiredField,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      moreThan: moreThan(0) as any,
    },
  },
];

const CurriculumSubjectForm = (
  props: FormProps<CurriculumSubjectFormType> & RequiredOptions
) => {
  const methods = useForm<CurriculumSubjectFormType>();

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(
          props.curriculumOptions,
          props.degreeLevelOptions,
          props.subjectTypeOptions,
          props.subjectAreasOptions
        )}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
      />
    </FormProvider>
  );
};

export default CurriculumSubjectForm;
