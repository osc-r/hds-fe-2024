"use client";

import {
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/modals/confirm";
import { SubmitHandler } from "react-hook-form";
import {
  useGetStudentGroupOptions,
  useGetTermOptions,
} from "../../../services/calendar/calendar.hook";
import {
  useDeleteScheduleConfigById,
  useGetSchedule,
} from "../../../services/class-scheduler/class-scheduler.hook";
import SearchTimetableForm, {
  SearchTimetableFormType,
} from "@/components/forms/timetable/SearchTimetableForm";
import dayjs, { Dayjs } from "dayjs";
import TimetableGrid from "@/components/timetable/TimetableGrid";

const dayMap: Record<string, string> = {
  "1": "Mon.",
  "2": "Tue.",
  "3": "Wed.",
  "4": "Thu.",
  "5": "Fri.",
  "6": "Sat.",
  "7": "Sun.",
};

export default function ListPage() {
  const router = useRouter();
  const selectedId = useRef("");
  const [queryKey, setQueryKey] = useState<SearchTimetableFormType>({
    academicTerm: "",
    isoWeekday: "",
    studentGroupId: "",
  });
  const [slot, setSlot] = useState<Dayjs[]>([]);

  const { data: termOptions } = useGetTermOptions("th");

  const { isLoading, data: classOptions } = useGetStudentGroupOptions(
    queryKey?.academicTerm || "",
    "th"
  );

  const { data, refetch } = useGetSchedule(
    queryKey.academicTerm,
    queryKey.studentGroupId,
    queryKey.isoWeekday
  );

  const { mutate, isPending } = useDeleteScheduleConfigById(() => {
    handleCloseConfirmModal();
    refetch();
  });

  const [open, setOpen] = useState(false);

  const onClickEdit = (id: string) => {
    router.push(`/timetable/${id}`);
  };

  const onConfirmDelete = () => {
    mutate(selectedId.current);
  };

  const handleCloseConfirmModal = () => setOpen(false);

  const onSearch: SubmitHandler<SearchTimetableFormType> = (dto) => {
    setQueryKey(dto);
    setTimeout(refetch, 300);
  };

  const TIME_PER_SLOT = 10;

  const findStartAndEndTime = () => {
    let start: Dayjs | undefined;
    let end: Dayjs | undefined;

    for (let index = 0; index < data.periodConfig.length; index++) {
      const item = data.periodConfig[index];

      const _start = dayjs()
        .set("h", item.timeSlot[0].startAt.h)
        .set("m", item.timeSlot[0].startAt.m);
      const _end = dayjs()
        .set("h", item.timeSlot[item.timeSlot.length - 1].endAt.h)
        .set("m", item.timeSlot[item.timeSlot.length - 1].endAt.m);

      if (index === 0) {
        start = _start;
        end = _end;
      } else {
        if (start && _start.isBefore(start)) {
          start = _start;
        }
        if (end && _end.isAfter(end)) {
          end = _end;
        }
      }
    }

    if (end && start) {
      const diff = end.diff(start, "m");
      setSlot(
        new Array(Math.ceil(diff / TIME_PER_SLOT))
          .fill(1)
          .map((i, index) => start.add(TIME_PER_SLOT * index, "m"))
      );
    }
  };

  useEffect(() => {
    findStartAndEndTime();
  }, [data]);

  return (
    <Container
      sx={{ py: 4, px: 0, display: "flex", width: "100%" }}
      maxWidth={"lg"}
    >
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography
            sx={{ typography: { sm: "h5", xs: "h6" } }}
            mb={{ sm: 2, xs: 1 }}
          >
            ตารางเรียนตารางสอน
          </Typography>
        </Grid>
        <Grid size={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push("/timetable/create");
            }}
          >
            เพิ่มตารางเรียนตารางสอน
          </Button>
          <Button variant="outlined" color="info" sx={{ ml: 2 }} disabled>
            พิมพ์
          </Button>
        </Grid>
        <Grid size={12} mb={2}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <SearchTimetableForm
              onSubmit={onSearch}
              termOptions={termOptions}
              onTermChange={(academicTerm) =>
                setQueryKey((o) => ({ ...o, academicTerm }))
              }
              classOptions={classOptions}
            />
            <Grid size={12} sx={{ overflow: "auto", position: "relative" }}>
              {data.timetable.length > 0 && data.periodConfig.length > 0 && (
                <TimetableGrid
                  timeSlot={slot}
                  timetable={data.timetable
                    .map((i, index) => {
                      const slots = i.periodAssignments.map((k, __index) => {
                        const config =
                          data.periodConfig.find(
                            (j) => j._id === k.periodConfig.id
                          )?.timeSlot || [];
                        const time = config[__index];

                        const _start = dayjs()
                          .set("h", time.startAt.h)
                          .set("m", time.startAt.m);
                        const _end = dayjs()
                          .set("h", time.endAt.h)
                          .set("m", time.endAt.m);
                        const _diff = _end.diff(_start, "m");
                        const colSpan = _diff / TIME_PER_SLOT;

                        return {
                          colSpan,
                          start: _start,
                          end: _end,
                          name: k.name.en,
                          caption:
                            _start.format("HH:mm") + "-" + _end.format("HH:mm"),
                        };
                      });
                      return {
                        day: i.isoWeekday,
                        room: `P.${i.studentGroup.grade}/${i.studentGroup.room}`,
                        slots,
                      };
                    })
                    .sort((a, b) => {
                      if (a.day > b.day) return 1;
                      if (a.day < b.day) return -1;
                      return 0;
                    })
                    .map((i) => ({ ...i, day: dayMap[i.day] }))}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmModal
        open={open}
        onClose={handleCloseConfirmModal}
        onConfirm={onConfirmDelete}
      />
    </Container>
  );
}
