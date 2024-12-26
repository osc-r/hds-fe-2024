import React from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { FormProvider, useForm } from "react-hook-form";
import { SearchHolidayDto } from "../../../services/calendar/calendar";

export type SearchHolidayFormType = SearchHolidayDto;

const FORM_COMPONENTS: FormComponent<SearchHolidayFormType>[] = [
  {
    name: "academicYear",
    label: "ปี",
    type: "SELECT",
    disabled: false,
    size: 2,
    labelSize: 0,
    inputSize: 12,
    menu: [
      { label: "2567", value: "2567" },
      { label: "2568", value: "2568" },
      { label: "2569", value: "2569" },
    ],
  },
  {
    name: "month",
    label: "เดือน",
    type: "SELECT",
    disabled: false,
    size: 2,
    labelSize: 0,
    inputSize: 12,
    menu: [
      { label: "มกราคม", value: "1" },
      { label: "กุมภาพันธ์", value: "2" },
      { label: "มีนาคม", value: "3" },
      { label: "เมษายน", value: "4" },
      { label: "พฤษภาคม", value: "5" },
      { label: "มิถุนายน", value: "6" },
      { label: "กรกฎาคม", value: "7" },
      { label: "สิงหาคม", value: "8" },
      { label: "กันยายน", value: "9" },
      { label: "ตุลาคม", value: "10" },
      { label: "พฤศจิกายน", value: "11" },
      { label: "ธันวาคม", value: "12" },
    ],
  },
];

const SearchHolidayForm = (props: FormProps<SearchHolidayFormType>) => {
  const methods = useForm<SearchHolidayFormType>();

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

export default SearchHolidayForm;
