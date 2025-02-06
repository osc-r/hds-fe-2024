import {
  CreateSubjectOfferedDto,
  Subject,
  SubjectOffered,
} from "../../../services/subject/subject";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { RequiredOptions } from "./type";
import { Box, Button } from "@mui/material";
import Table, { TableColumnProps } from "@/components/Table";
import { useEffect } from "react";
import { requiredField } from "../validation";

export type CurriculumSubjectOfferedFormType = CreateSubjectOfferedDto & {
  subject?: string;
  _subjectList?: { id: string; subject: Subject }[];
};

const FORM_COMPONENTS = (
  menu1: Menu,
  menu2: Menu,
  menu3: Menu,
  menu4: Menu
): FormComponent<CurriculumSubjectOfferedFormType>[] => [
  {
    name: "academicTerm",
    label: "ภาคเรียน",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 7,
    menu: menu1,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "degreeLevel",
    label: "ระดับชั้น",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 7,
    menu: menu2,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "grade",
    label: "ชั้นเรียน",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 7,
    menu: menu3,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "subject",
    label: "รหัสวิชา",
    type: "SELECT",
    disabled: false,
    size: 12,
    labelSize: 2.5,
    inputSize: 7,
    menu: menu4,
    validate: {
      required: requiredField,
    },
  },
];

const columns = (
  lang: string,
  subjectAreaOptions: {
    label: string;
    value: string;
  }[],
  subjectTypeOptions: {
    label: string;
    value: string;
  }[],
  onClickDelete: (index: number) => void
): TableColumnProps<SubjectOffered>[] => [
  {
    field: `subject.code.${lang}`,
    headerName: "รหัสวิชา",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: `subject.name.${lang}`,
    headerName: "ชื่อวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 160, wordBreak: "break-word" },
    },
  },
  {
    field: "subject.credit",
    headerName: "หน่วยกิต",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
  },
  {
    field: "subject.subjectType",
    headerName: "ประเภทวิชา",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 120, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectTypeOptions.find(
        (i) => i.value === row.subject.subjectType
      );
      return val?.label;
    },
  },
  {
    field: "subject.subjectAreas",
    headerName: "กลุ่มสาระการเรียนรู้",
    headerCellProps: { align: "center" },
    cellProps: {
      align: "center",
      style: { maxWidth: 120, wordBreak: "break-word" },
    },
    render: (row) => {
      const val = subjectAreaOptions.find(
        (i) => i.value === row.subject.subjectAreas
      );
      return val?.label;
    },
  },
  {
    field: "subject.hours",
    headerName: "จำนวน\nชั่วโมง(เต็ม)",
    headerCellProps: {
      align: "center",
      style: { maxWidth: 80, wordBreak: "break-word" },
    },
    cellProps: {
      align: "center",
    },
  },
  {
    field: "",
    headerName: "",
    headerCellProps: { align: "center" },
    cellProps: { align: "center" },
    render: (row) => {
      return (
        <Box>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              onClickDelete(row.index);
            }}
          >
            ลบ
          </Button>
        </Box>
      );
    },
  },
];

const CurriculumSubjectOfferedForm = (
  props: FormProps<CurriculumSubjectOfferedFormType> &
    RequiredOptions & {
      degreeLevelOptions: { label: string; value: string }[];
      subjectOptions: { label: string; value: string; data: Subject }[];
      subjectAreaOptions: {
        label: string;
        value: string;
      }[];
      subjectTypeOptions: {
        label: string;
        value: string;
      }[];
      onDegreeLevelChange: (degreeLevel: string) => void;
    }
) => {
  const methods = useForm<CurriculumSubjectOfferedFormType>();

  const {
    fields: subjectList,
    append,
    remove,
  } = useFieldArray({
    control: methods.control,
    name: "_subjectList", // unique name for your Field Array
  });

  const onClickAddSubject: SubmitHandler<CurriculumSubjectOfferedFormType> = (
    data
  ) => {
    const { subject: selectedSubjectId, _subjectList } = data;

    const selected = props.subjectOptions.find(
      (i) => i.value === selectedSubjectId
    );
    const existedSubjectIndex = (_subjectList || []).findIndex(
      (i) => i.id === selectedSubjectId
    );

    if (existedSubjectIndex >= 0) remove(existedSubjectIndex);
    if (selected) append({ id: selected.value, subject: selected.data });

    methods.resetField("subject");
  };

  const onClickDeleteSubject = (index: number) => {
    remove(index);
  };

  const degreeLevel = methods.watch("degreeLevel");

  useEffect(() => {
    props.onDegreeLevelChange(degreeLevel);
  }, [degreeLevel]);

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(
          props.academicTermOptions,
          props.degreeLevelOptions,
          props.classOptions,
          props.subjectOptions
        )}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
        // hideDefaultAction
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={methods.handleSubmit(onClickAddSubject)}
              sx={{ textAlign: "end" }}
            >
              เพิ่ม
            </Button>
          </Box>
          <br />
          <br />
          <Table
            columns={columns(
              "th",
              props.subjectAreaOptions,
              props.subjectTypeOptions,
              onClickDeleteSubject
            )}
            data={subjectList || []}
            showNumber
          />
        </Box>
      </FormRenderer>
    </FormProvider>
  );
};

export default CurriculumSubjectOfferedForm;
