import React from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, useForm } from "react-hook-form";
import { SearchEnrollmentByGroupDto } from "../../../services/subject/subject";

export type SearchEnrollmentGroupFormType = SearchEnrollmentByGroupDto;

const FORM_COMPONENTS = (
  menu1: Menu,
  menu2: Menu
): FormComponent<SearchEnrollmentGroupFormType>[] => [
  {
    name: "academicTerm",
    label: "ภาคเรียน",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu1,
  },
  {
    name: "grade",
    label: "ชั้นเรียน",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu2,
  },
];

const SearchEnrollmentGroupForm = (
  props: FormProps<SearchEnrollmentGroupFormType> & {
    termOptions: Menu;
    classOptions: Menu;
  }
) => {
  const methods = useForm<SearchEnrollmentGroupFormType>();

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormRenderer
          components={FORM_COMPONENTS(props.termOptions, props.classOptions)}
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
              methods.reset({ academicTerm: "", grade: "" });
            }}
          >
            รีเซ็ต
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SearchEnrollmentGroupForm;
