import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid2 as Grid,
  TextField,
  TextFieldVariants,
  Typography,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  FieldErrors,
  FieldValues,
  Path,
  SubmitHandler,
  useFormContext,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import styles from "./form-renderer.module.css";
import { HTMLInputTypeAttribute, PropsWithChildren, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Select from "../Select";

type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}` | `${K & string}.${NestedKeyOf<T[K]>}`
    : `${K & string}`;
}[keyof T];

type FormKeys<T> = NestedKeyOf<T>;

export type FormComponent<T> = {
  name: FormKeys<T> | "";
  label: string;
  type: "TEXT_INPUT" | "DATE_PICKER" | "EMPTY" | "CHECKBOX" | "SELECT";
  disabled: boolean;
  size: number;
  labelSize?: number;
  inputSize?: number;
  htmlInputType?: HTMLInputTypeAttribute;
  menu?: { label: string; value: string }[];
  variant?: TextFieldVariants;
};

const getInputComponent = <T extends FieldValues>(
  component: FormComponent<T>,
  register: UseFormRegister<T>,
  errors: FieldErrors<T>,
  watch: UseFormWatch<T>
) => {
  if (component.name === "") {
    return null;
  }
  const inputProps = {
    ...register(component.name as Path<T>, {
      valueAsNumber: component.htmlInputType === "number",
    }),
  };

  switch (component.type) {
    case "TEXT_INPUT":
      return (
        <TextField
          label={component.variant ? component.label : undefined}
          variant={component.variant || "outlined"}
          fullWidth
          size="small"
          {...inputProps}
          onChange={(e) => {
            inputProps.onChange(e);
          }}
          error={!!errors[component.name]}
          helperText={errors[component.name]?.message as string}
          disabled={component.disabled}
          type={component.htmlInputType}
        />
      );
    case "DATE_PICKER":
      const dateString = watch(inputProps.name);
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={styles["mui-date-picker"]}>
            <MobileDatePicker
              sx={{ width: "100%" }}
              disabled={component.disabled}
              {...inputProps}
              showDaysOutsideCurrentMonth
              onAccept={(date) => {
                inputProps.onChange({
                  target: {
                    name: component.name,
                    value: date?.toISOString(),
                  },
                  type: "change",
                });
              }}
              onChange={() => {}}
              value={dateString ? dayjs(dateString) : null}
            />
          </div>
        </LocalizationProvider>
      );
    case "CHECKBOX":
      const checked = watch(inputProps.name);
      return (
        <FormControlLabel
          control={
            <Checkbox
              {...inputProps}
              checked={checked !== undefined ? checked : false}
            />
          }
          label={component.label}
        />
      );
    case "SELECT":
      const select = watch(inputProps.name);
      return (
        <Select
          placeholder={component.label}
          menu={component.menu || []}
          {...inputProps}
          value={select}
        />
      );
    case "EMPTY":
    default:
      return null;
  }
};

type FormRendererProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  components: FormComponent<T>[];
  initialData?: T;
  isLoading?: boolean;
  hideDefaultAction?: boolean;
} & PropsWithChildren;

const FormRenderer = <T extends FieldValues>(props: FormRendererProps<T>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useFormContext<T>();

  const onSave: SubmitHandler<T> = (payload) => {
    props.onSubmit(payload);
  };

  useEffect(() => {
    if (props.initialData) reset({ ...props.initialData });
  }, [props.initialData]);

  return (
    <Grid size={12} container rowGap={2} spacing={2}>
      {props.components.map((component, index) => {
        return (
          <Grid container size={component.size} key={index}>
            <Grid
              size={component.labelSize || 6}
              display={component.labelSize === 0 ? "none" : "block"}
            >
              {component.type !== "CHECKBOX" && (
                <Typography typography={"body1"} textAlign={"end"}>
                  {component.label}
                </Typography>
              )}
            </Grid>
            <Grid size={component.inputSize || 6}>
              {getInputComponent<T>(component, register, errors, watch)}
            </Grid>
          </Grid>
        );
      })}

      {props.children}

      {props.hideDefaultAction ? null : (
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
              onClick={handleSubmit(onSave)}
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
      )}
    </Grid>
  );
};

export default FormRenderer;
