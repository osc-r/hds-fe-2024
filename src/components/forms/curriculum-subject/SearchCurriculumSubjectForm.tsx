import React from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, useForm } from "react-hook-form";
import { SearchSubjectDto } from "../../../services/subject/subject";
import { RequiredOptions } from "./type";

export type SearchCurriculumSubjectFormType = SearchSubjectDto;

const FORM_COMPONENTS = (
  menu1: Menu,
  menu2: Menu,
  menu3: Menu,
  menu4: Menu
): FormComponent<SearchCurriculumSubjectFormType>[] => [
  {
    name: "curriculum",
    label: "หลักสูตร",
    type: "SELECT",
    disabled: false,
    size: 6,
    labelSize: 0,
    inputSize: 12,
    menu: menu1,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "code",
    label: "รหัสวิชา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    variant: "outlined",
  },
  {
    name: "name",
    label: "ชื่อวิชา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    variant: "outlined",
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "subjectType",
    label: "ประเภทวิชา",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu2,
  },
  {
    name: "subjectAreas",
    label: "กลุ่มสาระการเรียนรู้",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu3,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "degreeLevel",
    label: "ระดับการศึกษา",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu4,
  },
];

const SearchCurriculumSubjectForm = (
  props: FormProps<SearchCurriculumSubjectFormType> & RequiredOptions
) => {
  const methods = useForm<SearchCurriculumSubjectFormType>();

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormRenderer
          components={FORM_COMPONENTS(
            props.curriculumOptions,
            props.subjectTypeOptions,
            props.subjectAreasOptions,
            props.degreeLevelOptions
          )}
          onSubmit={props.onSubmit}
          initialData={props.initialData}
          isLoading={props.isLoading}
          hideDefaultAction
        />
      </FormProvider>
      <Grid size={12} container spacing={2}>
        <Grid size={1.25}>
          <Button
            variant="outlined"
            color="info"
            disabled={props.isLoading}
            fullWidth
            onClick={methods.handleSubmit(props.onSubmit)}
          >
            {props.isLoading ? (
              <div style={{ display: "flex", color: "#FFFFFF88" }}>
                <CircularProgress size={"24px"} color="inherit" />
              </div>
            ) : (
              "ค้นหา"
            )}
          </Button>
        </Grid>
        <Grid
          size={1.25}
          sx={{
            color: "#a8a8a8",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            disabled={props.isLoading}
            fullWidth
            onClick={() => {
              methods.reset();
            }}
          >
            รีเซ็ต
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SearchCurriculumSubjectForm;
