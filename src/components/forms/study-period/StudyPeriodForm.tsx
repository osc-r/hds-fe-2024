import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { requiredField } from "../validation";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../form-renderer.module.css";
import { useRouter } from "next/navigation";
import { CreateStudyPeriodDto } from "../../../services/class-scheduler/class-scheduler";

export type StudyPeriodFormType = Omit<CreateStudyPeriodDto, "timeSlot"> & {
  openingTime: string;
  closingTime: string;
  numberOfPeriods: number;
  timeSlot: {
    startAt: string;
    endAt: string;
  }[];
};

const FORM_COMPONENTS = (
  disabled: boolean,
  menu1: {
    label: string;
    value: string;
  }[]
): FormComponent<StudyPeriodFormType>[] => [
  {
    name: "name",
    label: "ชื่อ",
    type: "SELECT",
    disabled: disabled,
    size: 6,
    validate: {
      required: requiredField,
    },
    menu: [
      { label: "set1", value: "set1" },
      { label: "set2", value: "set2" },
      { label: "set3", value: "set3" },
      { label: "set4", value: "set4" },
    ],
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "academicTerm",
    label: "ปีการศึกษา",
    type: "SELECT",
    disabled: disabled,
    size: 6,
    validate: {
      required: requiredField,
    },
    menu: menu1,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "openingTime",
    label: "เวลาเริ่มเรียน",
    type: "TIME_PICKER",
    disabled: false,
    size: 6,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "closingTime",
    label: "เวลาเลิกเรียน",
    type: "TIME_PICKER",
    disabled: false,
    size: 6,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "numberOfPeriods",
    label: "จำนวนคาบเรียน",
    type: "TEXT_INPUT",
    disabled: false,
    size: 6,
    htmlInputType: "number",
    validate: {
      required: requiredField,
    },
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "isStudyOnWeekend",
    label: "เรียนวันเสาร์-อาทิตย์",
    type: "CHECKBOX",
    disabled: false,
    size: 12,
    labelSize: 3,
    inputSize: 7,
  },
];

const StudyPeriodForm = (
  props: FormProps<StudyPeriodFormType> & {
    termOptions: {
      label: string;
      value: string;
    }[];
  }
) => {
  const router = useRouter();

  const methods = useForm<StudyPeriodFormType>({ criteriaMode: "all" });
  const {
    formState: { errors },
  } = methods;

  const openingTime = methods.watch("openingTime");
  const closingTime = methods.watch("closingTime");
  const numberOfPeriods = methods.watch("numberOfPeriods");

  const { fields, append, remove, swap, move, insert, update } = useFieldArray({
    control: methods.control,
    name: "timeSlot",
  });

  useEffect(() => {
    if (numberOfPeriods && openingTime && closingTime) {
      remove();
      const _closingTime = dayjs(closingTime);
      const _openingTime = dayjs(openingTime);
      const msDiff = _closingTime.diff(_openingTime);
      const minutesPerPeriod = msDiff / numberOfPeriods / 1000 / 60;

      for (let i = 0; i < numberOfPeriods; i++) {
        const startAt = _openingTime.add(i * minutesPerPeriod, "minutes");
        const endAt = _openingTime.add(
          i * minutesPerPeriod + minutesPerPeriod,
          "minutes"
        );
        append({
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        });
      }
    }
  }, [numberOfPeriods, openingTime, closingTime]);

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(!!props.initialData, props.termOptions)}
        onSubmit={props.onSubmit}
        initialData={props.initialData}
        isLoading={props.isLoading}
        hideDefaultAction
      />
      <br />
      <Divider />
      <br />
      <br />
      <Grid container spacing={2}>
        {fields.length > 0 && (
          <React.Fragment>
            <Grid size={4} />
            <Grid size={4}>
              <span>เวลาเริ่มคาบเรียน</span>
            </Grid>
            <Grid size={4}>
              <span>เวลาหมดคาบเรียน</span>
            </Grid>
          </React.Fragment>
        )}
        <Grid size={12}>
          <br />
        </Grid>
        {fields.map((a, i) => {
          const startName = `timeSlot.${i}.startAt` as const;
          const endName = `timeSlot.${i}.endAt` as const;

          const startInputProps = methods.register(startName, {
            validate: {
              validate: (val) => {
                const endVal = methods.getValues(endName);
                const end = dayjs(endVal);
                return (
                  dayjs(val).isBefore(end) || "*Must select time before endTime"
                );
              },
            },
            deps: [endName],
          });
          const endInputProps = methods.register(endName, {
            validate: {
              validate: (val) => {
                const startVal = methods.getValues(startName);
                const start = dayjs(startVal);
                return (
                  dayjs(val).isAfter(start) ||
                  "*Must select time after startTime"
                );
              },
            },
            deps: [startName],
          });

          return (
            <React.Fragment key={i}>
              <Grid size={4}>
                <span>คาบเรียนที่ {i + 1}</span>
              </Grid>
              <Grid size={4}>
                <FormControl style={{ width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div
                      className={
                        styles[
                          !!errors.timeSlot?.[i]?.startAt
                            ? "mui-date-picker-error"
                            : "mui-date-picker"
                        ]
                      }
                    >
                      <MobileTimePicker
                        sx={{ width: "100%", borderColor: "red" }}
                        {...startInputProps}
                        onAccept={(date) => {
                          startInputProps.onChange({
                            target: {
                              name: startName,
                              value: date?.toISOString(),
                            },
                            type: "change",
                          });
                          if (i !== 0) {
                            update(i - 1, {
                              ...methods.getValues(`timeSlot.${i - 1}`),
                              endAt: date?.toISOString() || "",
                            });
                          }
                        }}
                        onChange={() => {}}
                        value={dayjs(a.startAt)}
                        ampm={false}
                        ampmInClock={false}
                      />
                    </div>
                  </LocalizationProvider>
                  <FormHelperText error={!!errors.timeSlot?.[i]?.startAt}>
                    {errors.timeSlot?.[i]?.startAt?.message as string}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl style={{ width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div
                      className={
                        styles[
                          !!errors.timeSlot?.[i]?.endAt
                            ? "mui-date-picker-error"
                            : "mui-date-picker"
                        ]
                      }
                    >
                      <MobileTimePicker
                        sx={{ width: "100%", borderColor: "red" }}
                        {...endInputProps}
                        onAccept={(date) => {
                          endInputProps.onChange({
                            target: {
                              name: endName,
                              value: date?.toISOString(),
                            },
                            type: "change",
                          });
                          if (i + 1 < fields.length) {
                            update(i + 1, {
                              ...methods.getValues(`timeSlot.${i + 1}`),
                              startAt: date?.toISOString() || "",
                            });
                          }
                        }}
                        onChange={() => {}}
                        value={dayjs(a.endAt)}
                        ampm={false}
                        ampmInClock={false}
                      />
                    </div>
                  </LocalizationProvider>
                  <FormHelperText error={!!errors.timeSlot?.[i]?.endAt}>
                    {errors.timeSlot?.[i]?.endAt?.message as string}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>

      <Grid size={12}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            color="info"
            onClick={() => router.back()}
            disabled={props.isLoading}
          >
            ย้อนกลับ
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 2 }}
            onClick={methods.handleSubmit(props.onSubmit)}
            disabled={props.isLoading}
          >
            {props.isLoading ? (
              <div style={{ display: "flex", color: "#FFFFFF88" }}>
                <CircularProgress size={"24px"} color="inherit" />
              </div>
            ) : (
              "บันทึก"
            )}
          </Button>
        </Box>
      </Grid>
    </FormProvider>
  );
};

export default StudyPeriodForm;
