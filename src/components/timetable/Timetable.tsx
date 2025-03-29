import React from "react";
import styles from "./timetable.module.css";
import { Dayjs } from "dayjs";

const MINUTE_PER_SLOT = 15;
const BASE_COL_SPAN = 6;

type TimetableProps = {
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

const Timetable = (props: TimetableProps) => {
  const { timeSlot, timetable } = props;

  return (
    <table className={styles.tableWrapper}>
      <thead>
        <tr>
          <th>
            <div>DAY</div>
          </th>
          <th>
            <div>GRADE</div>
          </th>
          {timeSlot.map((i, index) => (
            <th key={index} colSpan={BASE_COL_SPAN}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 12 }}>&nbsp;{i.format("HH:mm")}</span>
                <span style={{ opacity: 0.35, fontSize: 12 }}>
                  -{i.add(15, "m").format("HH:mm")}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...timetable].map((i, index) => {
          return (
            <tr key={index}>
              <th>
                <div>{i.day}</div>
              </th>
              <th>
                <div>{i.room}</div>
              </th>
              {i.slots.map((j, _index) => {
                const diff = j.start.diff(
                  _index === 0 ? timeSlot[0] : i.slots[_index - 1].end,
                  "m"
                );
                return (
                  <React.Fragment key={_index}>
                    {diff > 0 && (
                      <td
                        colSpan={(diff / MINUTE_PER_SLOT) * BASE_COL_SPAN}
                        style={{
                          border: "none",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <td colSpan={j.colSpan * BASE_COL_SPAN}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>{j.name}</div>
                        <div>{j.caption}</div>
                      </div>
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Timetable;
