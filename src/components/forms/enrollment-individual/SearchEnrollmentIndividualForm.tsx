import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  TextField,
} from "@mui/material";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps, Menu } from "../form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { requiredField } from "../validation";
import SearchIcon from "@mui/icons-material/Search";
import SearchStudentModal from "@/components/modals/search-student";
import { SearchStudentFormType } from "./SearchStudentForm";
import { useGetStudentGroupByTermId } from "../../../services/calendar/calendar.hook";

export type SearchEnrollmentIndividualFormType = {
  academicTerm: string;
  studentId: string;
};

const FORM_COMPONENTS = (
  menu1: Menu
): FormComponent<SearchEnrollmentIndividualFormType>[] => [
  {
    name: "academicTerm",
    label: "ภาคเรียน",
    type: "SELECT",
    disabled: false,
    size: 7,
    labelSize: 0,
    inputSize: 12,
    menu: menu1,
    validate: {
      required: requiredField,
    },
  },
];

const SearchEnrollmentIndividualForm = (
  props: FormProps<SearchEnrollmentIndividualFormType> & {
    termOptions: Menu;
    classOptions: Menu;
  }
) => {
  const methods = useForm<SearchEnrollmentIndividualFormType>();
  const {
    formState: { errors },
    register,
  } = methods;

  register("studentId", {
    validate: requiredField,
  });

  const academicTerm = methods.watch("academicTerm");

  const [open, setOpen] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [queryKey, setQueryKey] = useState<SearchStudentFormType>();

  const { data: students } = useGetStudentGroupByTermId(
    academicTerm,
    queryKey?.degreeLevel,
    queryKey?.grade,
    queryKey?.room
  );

  const onSearchStudent: SubmitHandler<SearchStudentFormType> = (dto) => {
    const selectedClass = props.classOptions.find(
      (i) => i.value === (dto.grade as unknown as string)
    );

    setQueryKey({
      ...dto,
      degreeLevel: selectedClass?.data?.degreeLevel || "",
      grade: selectedClass?.data?.grade || "",
      room: selectedClass?.data?.room || "",
    });
  };

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormRenderer
          components={FORM_COMPONENTS(props.termOptions)}
          onSubmit={props.onSubmit}
          initialData={props.initialData}
          isLoading={props.isLoading}
          hideDefaultAction
        />
      </FormProvider>
      <Grid size={7}>
        <FormControl sx={{ width: "100%" }}>
          <button
            onClick={async () => {
              await methods.trigger();
              if (!methods.getFieldState("academicTerm").invalid) {
                setOpen(true);
              }
            }}
            style={{ border: "none", lineHeight: 2, width: "100%" }}
          >
            <TextField
              label={"ชื่อ-นามสกุล"}
              variant={"outlined"}
              fullWidth
              size="small"
              slotProps={{ input: { endAdornment: <SearchIcon /> } }}
              disabled
              value={studentName}
              sx={{ pointerEvents: "none" }}
              error={!!errors.studentId}
            />
          </button>
          {errors.studentId && <FormHelperText error>*Required</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid size={12} container spacing={2}>
        <Grid size={3}>
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
          size={3}
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
              methods.reset({ academicTerm: "", studentId: "" });
              props.onSubmit({ academicTerm: "", studentId: "" });
              setStudentName("");
            }}
          >
            รีเซ็ต
          </Button>
        </Grid>
      </Grid>

      <SearchStudentModal
        students={students}
        onSearch={onSearchStudent}
        academicTermId={academicTerm || ""}
        academicTermLabel={
          props.termOptions.find((i) => i.value === academicTerm)?.label || ""
        }
        classOptions={props.classOptions}
        open={open}
        onClose={() => setOpen(false)}
        onSelectStudent={(studentId, _studentName) => {
          setOpen(false);
          setStudentName(_studentName);
          methods.setValue("studentId", studentId, { shouldValidate: true });
        }}
      />
    </React.Fragment>
  );
};

export default SearchEnrollmentIndividualForm;
