import React from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { FormProvider, useForm } from "react-hook-form";

export type SearchSubjectFormType = { code: string; name: string };

const FORM_COMPONENTS: FormComponent<SearchSubjectFormType>[] = [
  {
    name: "code",
    label: "รหัสวิชา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 3,
    inputSize: 9,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "name",
    label: "ชื่อวิชา",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    labelSize: 3,
    inputSize: 9,
  },
];

const SearchSubjectForm = (props: FormProps<SearchSubjectFormType>) => {
  const methods = useForm<SearchSubjectFormType>();

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormRenderer
          components={FORM_COMPONENTS}
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
              methods.reset({ code: "", name: "" });
            }}
          >
            รีเซ็ต
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SearchSubjectForm;
