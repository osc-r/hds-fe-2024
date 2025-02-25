import React from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, useForm } from "react-hook-form";
// import { requiredField } from "../validation";
import { SearchStudentGroupByTermIdDto } from "../../../services/calendar/calendar";

export type SearchStudentFormType = SearchStudentGroupByTermIdDto;

const FORM_COMPONENTS = (
  menu1: Menu
): FormComponent<SearchStudentFormType>[] => [
  {
    name: "search",
    label: "ค้นหา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 3,
    inputSize: 9,
    menu: menu1,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "grade",
    label: "ชั้นเรียน",
    type: "SELECT",
    disabled: false,
    size: 6,
    labelSize: 3,
    inputSize: 9,
    menu: menu1,
  },
];

const SearchStudentForm = (
  props: FormProps<SearchStudentFormType> & {
    classOptions: Menu;
  }
) => {
  const methods = useForm<SearchStudentFormType>();

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormRenderer
          components={FORM_COMPONENTS(props.classOptions)}
          onSubmit={props.onSubmit}
          initialData={props.initialData}
          isLoading={props.isLoading}
          hideDefaultAction
        />
      </FormProvider>
      <Grid size={12} container spacing={2}>
        <Grid size={1.5} />
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
              methods.reset({ search: "", grade: "" });
            }}
          >
            รีเซ็ต
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SearchStudentForm;
