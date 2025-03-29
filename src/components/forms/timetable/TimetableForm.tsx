import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import FormRenderer, { FormComponent } from "../FormRenderer";
import { FormProps } from "../form";
import { requiredField } from "../validation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../form-renderer.module.css";
import { useRouter } from "next/navigation";
import {
  CreateStudyPeriodDto,
  TimeSlot,
} from "../../../services/class-scheduler/class-scheduler";
import Select from "@/components/Select";

export type TimetableFormType = Omit<CreateStudyPeriodDto, "timeSlot"> & {
  timeSlot: {
    startAt: string;
    endAt: string;
    activity: string;
    instructor: string;
    buildingRoom: string;
    isCombinedClass: boolean;
  }[];
  periodConfig: string;
  studentGroup: string;
  isoWeekday: string;
};

const FORM_COMPONENTS = (
  disabled: boolean,
  menu1: {
    label: string;
    value: string;
  }[],
  menu2: {
    label: string;
    value: string;
  }[],
  menu3: {
    label: string;
    value: string;
  }[]
): FormComponent<TimetableFormType>[] => [
  {
    name: "academicTerm",
    label: "ปีการศึกษา",
    type: "SELECT",
    disabled: disabled,
    size: 6,
    labelSize: 0,
    inputSize: 12,
    validate: {
      required: requiredField,
    },
    menu: menu1,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "studentGroup",
    label: "ชั้นเรียน",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: menu2,
    validate: {
      required: requiredField,
    },
  },
  {
    name: "periodConfig",
    label: "Config set",
    type: "SELECT",
    disabled: disabled,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    validate: {
      required: requiredField,
    },
    menu: menu3,
  },
  { name: "", label: "", type: "EMPTY", disabled: false, size: 6 },
  {
    name: "isoWeekday",
    label: "วัน",
    type: "SELECT",
    disabled: false,
    size: 3,
    labelSize: 0,
    inputSize: 12,
    menu: [
      { label: "Mon", value: "1" },
      { label: "Tue", value: "2" },
      { label: "Wed", value: "3" },
      { label: "Thu", value: "4" },
      { label: "Fri", value: "5" },
      { label: "Sat", value: "6" },
      { label: "Sun", value: "7" },
    ],
    validate: {
      required: requiredField,
    },
  },
];

const TimetableForm = (
  props: FormProps<TimetableFormType> & {
    termOptions: {
      label: string;
      value: string;
    }[];
    classOptions: {
      label: string;
      value: string;
    }[];
    activityOptions: {
      label: string;
      value: string;
    }[];
    instructorOptions: {
      label: string;
      value: string;
    }[];
    classroomOptions: {
      label: string;
      value: string;
    }[];
    configOptions: {
      label: string;
      value: string;
      data: TimeSlot[];
    }[];
    onAcademicTermChange: (academicTerm: string) => void;
  }
) => {
  const router = useRouter();

  const methods = useForm<TimetableFormType>({ criteriaMode: "all" });
  const {
    formState: { errors },
  } = methods;

  const academicTerm = methods.watch("academicTerm");
  const periodConfig = methods.watch("periodConfig");

  const { fields, append, remove, swap, move, insert, update } = useFieldArray({
    control: methods.control,
    name: "timeSlot",
  });

  // useEffect(() => {
  //   if (numberOfPeriods && openingTime && closingTime) {
  //     remove();
  //     const _closingTime = dayjs(closingTime);
  //     const _openingTime = dayjs(openingTime);
  //     const msDiff = _closingTime.diff(_openingTime);
  //     const minutesPerPeriod = msDiff / numberOfPeriods / 1000 / 60;

  //     for (let i = 0; i < numberOfPeriods; i++) {
  //       const startAt = _openingTime.add(i * minutesPerPeriod, "minutes");
  //       const endAt = _openingTime.add(
  //         i * minutesPerPeriod + minutesPerPeriod,
  //         "minutes"
  //       );
  //       append({
  //         startAt: startAt.toISOString(),
  //         endAt: endAt.toISOString(),
  //       });
  //     }
  //   }
  // }, [numberOfPeriods, openingTime, closingTime]);

  useEffect(() => {
    props.onAcademicTermChange(academicTerm);
  }, [academicTerm]);

  useEffect(() => {
    remove();
    const config = props.configOptions.find((i) => i.value === periodConfig);
    if (config) {
      config.data.forEach((slot) => {
        const startAt = dayjs()
          .set("hour", slot.startAt.h)
          .set("minutes", slot.startAt.m);
        const endAt = dayjs()
          .set("hour", slot.endAt.h)
          .set("minutes", slot.endAt.m);

        append({
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          activity: "",
          buildingRoom: "",
          instructor: "",
          isCombinedClass: false,
        });
      });
    }
  }, [periodConfig]);

  return (
    <FormProvider {...methods}>
      <FormRenderer
        components={FORM_COMPONENTS(
          !!props.initialData,
          props.termOptions,
          props.classOptions,
          props.configOptions
        )}
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
            <Grid size={1.25} />
            <Grid size={1.9}>
              <span>เวลาเริ่มเรียน</span>
            </Grid>
            <Grid size={1.9}>
              <span>เวลาหมดเรียน</span>
            </Grid>
            <Grid size={1.9}>
              <span>วิชาเรียน</span>
            </Grid>
            <Grid size={1.9}>
              <span>ครูผู้สอน</span>
            </Grid>
            <Grid size={1.9}>
              <span>ห้องเรียน</span>
            </Grid>
            <Grid size={1.25}>
              <span>เรียนรวม</span>
            </Grid>
          </React.Fragment>
        )}
        <Grid size={12}></Grid>
        {fields.map((a, i) => {
          const startName = `timeSlot.${i}.startAt` as const;
          const endName = `timeSlot.${i}.endAt` as const;
          const activity = `timeSlot.${i}.activity` as const;
          const instructor = `timeSlot.${i}.instructor` as const;
          const buildingRoom = `timeSlot.${i}.buildingRoom` as const;
          const isCombinedClass = `timeSlot.${i}.isCombinedClass` as const;

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
          const activityInputProps = methods.register(activity, {
            validate: {
              required: requiredField,
            },
          });
          const instructorInputProps = methods.register(instructor, {
            validate: {
              required: requiredField,
            },
          });
          const buildingRoomInputProps = methods.register(buildingRoom, {
            validate: {
              required: requiredField,
            },
          });
          const isCombinedClassInputProps = methods.register(isCombinedClass, {
            validate: {
              required: requiredField,
            },
          });

          const activityValue = methods.watch(activity);
          const instructorValue = methods.watch(instructor);
          const buildingRoomValue = methods.watch(buildingRoom);

          return (
            <React.Fragment key={i}>
              <Grid size={1.25}>
                <span>คาบที่ {i + 1}</span>
              </Grid>
              <Grid size={1.9}>
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
              <Grid size={1.9}>
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
              <Grid size={1.9}>
                <Select
                  placeholder={"Activity"}
                  menu={props.activityOptions}
                  {...activityInputProps}
                  value={activityValue}
                  errorMessage={
                    errors?.timeSlot?.[i]?.activity?.message as string
                  }
                />
              </Grid>
              <Grid size={1.9}>
                <Select
                  placeholder={"Instructor"}
                  menu={props.instructorOptions}
                  {...instructorInputProps}
                  value={instructorValue}
                  errorMessage={
                    errors?.timeSlot?.[i]?.instructor?.message as string
                  }
                />
              </Grid>
              <Grid size={1.9}>
                <Select
                  placeholder={"Building Room"}
                  menu={props.classroomOptions}
                  {...buildingRoomInputProps}
                  value={buildingRoomValue}
                  errorMessage={
                    errors?.timeSlot?.[i]?.buildingRoom?.message as string
                  }
                />
              </Grid>
              <Grid size={1.25}>
                <Checkbox
                  {...isCombinedClassInputProps}
                  // checked={checked !== undefined ? checked : false}
                />
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

export default TimetableForm;
