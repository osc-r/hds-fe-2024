import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
  PathValue,
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
  UseFormRegister,
  UseFormWatch,
  Validate,
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
  validate?:
    | Validate<PathValue<T, Path<T>>, T>
    | Record<string, Validate<PathValue<T, Path<T>>, T>>;
};

const getError = <T extends FieldValues>(
  name: string,
  errors: FieldErrors<T>
) => {
  const propertyName = name.split(".");
  const getValue = (_name: string[], _errors: FieldErrors<T>) => {
    const key = _name.shift() || "";
    if (_name.length === 0) {
      if (_errors && _errors[key]) return _errors[key]?.message;
      else return undefined;
    } else {
      return getValue(_name, _errors[key] as unknown as FieldErrors<T>);
    }
  };
  return getValue(propertyName, errors);
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
      validate: component.validate,
    }),
  };

  switch (component.type) {
    case "TEXT_INPUT":
      const errorMsg = getError(component.name, errors) as string;
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
          error={!!errorMsg}
          helperText={errorMsg}
          disabled={component.disabled}
          type={component.htmlInputType}
        />
      );
    case "DATE_PICKER":
      const dateString = watch(inputProps.name);
      return (
        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
              className={
                styles[
                  !!errors[component.name]
                    ? "mui-date-picker-error"
                    : "mui-date-picker"
                ]
              }
            >
              <MobileDatePicker
                sx={{ width: "100%", borderColor: "red" }}
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
          <FormHelperText error={!!errors[component.name]}>
            {errors[component.name]?.message as string}
          </FormHelperText>
        </FormControl>
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
          disabled={component.disabled}
          {...inputProps}
          value={select}
          errorMessage={errors[component.name]?.message as string}
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
  onInvalid?: SubmitErrorHandler<T>;
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
    setTimeout(() => {
      if (props.initialData) {
        reset({ ...props.initialData });
      }
    }, 300);
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
              onClick={handleSubmit(onSave, props.onInvalid)}
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
