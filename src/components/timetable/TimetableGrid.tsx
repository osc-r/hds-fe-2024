import React from "react";
import { Dayjs } from "dayjs";
import { Grid2 as Grid } from "@mui/material";
import styles from "./timetable.module.css";

const MINUTE_PER_SLOT = 10;
const CELL_SIZE = 60;

type TimetableGridProps = {
  timeSlot: Dayjs[];
  timetable: {
    day: string;
    room: string;
    slots: {
      colSpan: number;
      start: Dayjs;
      end: Dayjs;
      name: string;
      caption: string;
    }[];
  }[];
};

const TimetableGrid = (props: TimetableGridProps) => {
  const { timeSlot, timetable } = props;

  return (
    <div className={styles.gridWrapper}>
      <Grid container columns={timeSlot.length + 2}>
        <Grid
          size={timeSlot.length + 3}
          container
          columns={timeSlot.length + 3}
        >
          <Grid
            container
            size={2}
            sx={{
              minWidth: CELL_SIZE * 2,
            }}
          >
            <Grid
              size={1}
              sx={{
                minWidth: CELL_SIZE,
              }}
            >
              Day
            </Grid>
            <Grid
              size={1}
              sx={{
                minWidth: CELL_SIZE,
              }}
            >
              Grade
            </Grid>
          </Grid>

          {timeSlot.map((i, index) => (
            <Grid
              key={index}
              size={1}
              sx={{
                minWidth: CELL_SIZE,
              }}
            >
              <span>&nbsp;{i.format("HH:mm")}</span>
              <span>-{i.add(MINUTE_PER_SLOT, "m").format("HH:mm")}</span>
            </Grid>
          ))}
        </Grid>
        {timetable.map((i, index) => {
          return (
            <Grid
              key={index}
              size={timeSlot.length + 3}
              container
              columns={timeSlot.length + 3}
            >
              <Grid
                container
                size={2}
                sx={{
                  minWidth: CELL_SIZE * 2,
                }}
              >
                <Grid
                  size={1}
                  sx={{
                    minWidth: CELL_SIZE,
                  }}
                >
                  {i.day}
                </Grid>
                <Grid
                  size={1}
                  sx={{
                    minWidth: CELL_SIZE,
                  }}
                >
                  {i.room}
                </Grid>
              </Grid>

              {i.slots.map((j, _index) => {
                const diff = j.start.diff(
                  _index === 0 ? timeSlot[0] : i.slots[_index - 1].end,
                  "m"
                );
                return (
                  <React.Fragment key={_index}>
                    {diff > 0 && (
                      <Grid
                        size={diff / MINUTE_PER_SLOT}
                        sx={{
                          minWidth: (CELL_SIZE * diff) / MINUTE_PER_SLOT,
                        }}
                      />
                    )}
                    <Grid
                      size={Math.ceil(j.colSpan * 100) / 100}
                      sx={{
                        minWidth: CELL_SIZE * j.colSpan,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>{j.name}</div>
                        <div>{j.caption}</div>
                      </div>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default TimetableGrid;
