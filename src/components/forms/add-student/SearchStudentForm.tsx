import {
  Box,
  Button,
  Grid,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { TabPanel } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import hdsv2GroupsService from "../../../services/hdsv2-groups/hdsv2-groups.service";
import Select from "@/components/Select";

type SearchStudentFormProps = {
  onSubmit: Function;
  defaultLevel?: string;
  defaultGrade?: string;
};

type SearchStudentForm = {
  keyword: string;
  level: string;
  grade: string;
  room: string;
};

const SearchStudentForm = (props: SearchStudentFormProps) => {
  const methods = useForm<SearchStudentForm>({
    mode: "all",
  });
  const {
    formState: { errors },
  } = methods;

  const [levelList, setLevelList] = useState<
    {
      label: string;
      value: string;
      data: any;
    }[]
  >([]);

  const [masterGroupOption, setMasterGroupOption] = useState<any[]>([]);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string; studentId: string[] }[]
  >([]);
  const [gradeOptions, setGradeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [tabValue, setTabValue] = useState<"OPTIONS" | "KEYWORD">("OPTIONS");

  useEffect(() => {
    const fetchLevelList = async () => {
      // const { success, payload } =
      //   await invoiceTemplateService.getLevelOptions();
      // if (success && payload) {
      //   setLevelList(payload);
      // }
    };

    const fetchStudentGroup = async () => {
      // const { success, payload } = await hdsv2GroupsService.getGroups();
      // if (success) {
      //   setMasterGroupOption(payload);
      // }
    };

    fetchStudentGroup();
    fetchLevelList();
  }, []);

  useEffect(() => {
    if (props.defaultLevel) {
      methods.setValue("level", props.defaultLevel);
      changeLevel(props.defaultLevel);
    }
    if (props.defaultGrade) {
      methods.setValue("grade", props.defaultGrade);
      changeGrade(props.defaultGrade);
    }

    if (props.defaultLevel && props.defaultGrade) {
      onSubmit({
        level: props.defaultLevel || "",
        grade: props.defaultGrade || "",
        room: "ALL",
        keyword: "",
      });
    }
  }, [props.defaultLevel, props.defaultGrade, levelList, masterGroupOption]);

  const onSubmit = (data: SearchStudentForm) => {
    if (tabValue === "KEYWORD") {
      props.onSubmit && props.onSubmit(data, tabValue);
      return;
    }
    const filteredOptions = masterGroupOption
      .filter((i) => i.data.level === data.level)
      .filter((i) =>
        data.grade === "ALL" ? true : data.grade === i.data.levelYear
      );
    if (data.room !== "ALL") {
      const currentRoom = masterGroupOption.find((i) => i.value === data.room);
      props.onSubmit && props.onSubmit(currentRoom.studentId, tabValue);
    } else {
      const ids: string[] = [];
      filteredOptions.forEach((i) => ids.push(...i.studentId));
      props.onSubmit && props.onSubmit(ids, tabValue);
    }
  };

  const onChangeTab = (
    _: React.SyntheticEvent,
    newValue: "OPTIONS" | "KEYWORD"
  ) => {
    setTabValue(newValue);
    methods.setValue("keyword", "");
  };

  const mapCb = (i: any) => {
    return {
      ...i,
      label: i.label[i.label.length - 1],
    };
  };

  const changeLevel = (level: string) => {
    methods.setValue("level", level);
    methods.setValue("grade", "ALL");
    methods.setValue("room", "ALL");

    const currentLevel = masterGroupOption.filter(
      (i) => i.data.level === level
    );

    const grade: { [key: string]: string } = {};
    currentLevel.forEach((i) => {
      grade[i.data.levelYear as string] = i.data.levelYear;
    });

    const gradeArr = [];
    for (const [_, val] of Object.entries(grade)) {
      gradeArr.push({ label: val, value: val });
    }

    setGradeOptions(gradeArr);
    if (level === "เตรียมอนุบาล") {
      setGroupOptions(
        masterGroupOption
          .filter((i) => i.data.level === level)
          .map(mapCb)
          .sort((a, b) => {
            if (parseInt(a.label) < parseInt(b.label)) {
              return -1;
            } else if (parseInt(a.label) > parseInt(b.label)) {
              return 1;
            } else {
              return 0;
            }
          })
      );
    } else {
      setGroupOptions([]);
    }
  };

  const onChangeLevel = (event: SelectChangeEvent<unknown>) => {
    levelInput.onChange(event);
    const level = event.target.value as string;
    changeLevel(level);
  };

  const changeGrade = (grade: string) => {
    methods.setValue("grade", grade);
    methods.setValue("room", "ALL");

    setGroupOptions(
      masterGroupOption
        .filter((i) =>
          i.data.levelYear === "-"
            ? i.data.level === methods.watch("level")
            : i.data.level === methods.watch("level") &&
              i.data.levelYear === grade
        )
        .map(mapCb)
        .sort((a, b) => {
          if (parseInt(a.label) < parseInt(b.label)) {
            return -1;
          } else if (parseInt(a.label) > parseInt(b.label)) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  };

  const onChangeGrade = (event: SelectChangeEvent<unknown>) => {
    gradeInput.onChange(event);
    const grade = event.target.value as string;
    changeGrade(grade);
  };

  const levelInput = methods.register("level", {
    // required: true,
  });

  const gradeInput = methods.register("grade", {
    // required: true,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container rowSpacing={0.5} columnSpacing={1}>
          <Grid item xs={12} md={12}>
            <TabContext value={tabValue}>
              <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
                <Tabs
                  value={tabValue}
                  onChange={onChangeTab}
                  sx={{ borderBottom: 1, borderColor: "rgba(0, 0, 0, 0.12)" }}
                >
                  <Tab label="ห้อง" value={"OPTIONS"} />
                  <Tab label="นักเรียน" value={"KEYWORD"} />
                </Tabs>
                <TabPanel value={"OPTIONS"}>
                  <Grid container rowSpacing={0.5} columnSpacing={1}>
                    <Grid item xs={6} md={4}>
                      <Select
                        placeholder="ระดับชั้น"
                        menu={[]}
                        {...levelInput}
                        onChange={onChangeLevel}
                        {...(errors.level && {
                          error: true,
                          helperText: errors.level.message,
                        })}
                        value={methods.watch("level")}
                        // disabled={!!props.defaultLevel}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Select
                        placeholder="ชั้นปีที่"
                        menu={
                          []
                          //   [{ value: "ALL", label: "ทั้งหมด" }].concat(
                          //   gradeOptions
                          // )
                        }
                        {...gradeInput}
                        onChange={onChangeGrade}
                        {...(errors.grade && {
                          error: true,
                          helperText: errors.grade.message,
                        })}
                        value={methods.watch("grade")}
                        // disabled={!!props.defaultGrade}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Select
                        placeholder="ห้อง"
                        menu={[]}
                        {...methods.register("room", {
                          //   required: true,
                        })}
                        {...(errors.room && {
                          error: true,
                          helperText: errors.room.message,
                        })}
                        value={methods.watch("room")}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={"KEYWORD"}>
                  <Grid container rowSpacing={0.5} columnSpacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        margin="dense"
                        label="ค้นหา"
                        fullWidth
                        size="small"
                        variant="outlined"
                        {...methods.register("keyword")}
                        {...(errors.keyword && {
                          error: true,
                          helperText: errors.keyword.message,
                        })}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                <Grid item xs={10} md={2} sx={{ m: 3, mt: 0 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    fullWidth
                  >
                    ค้นหา
                  </Button>
                </Grid>
              </Box>
            </TabContext>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default SearchStudentForm;
