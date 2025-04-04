"use client";

import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, createTheme } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import PersonIcon from "@mui/icons-material/Person";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { usePathname, useRouter } from "next/navigation";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "นักเรียน",
  },
  {
    title: "รายชื่อนักเรียน",
    icon: <PersonIcon />,
    segment: "student",
  },
  { kind: "divider" },
  {
    kind: "header",
    title: "จัดการข้อมูลโรงเรียน",
  },
  {
    title: "ปฏิทินการศึกษา",
    icon: <CalendarMonthIcon />,
    segment: "academic-calendar",
    kind: "page",
  },
  {
    title: "ข้อมูลวันหยุด",
    icon: <CalendarMonthIcon />,
    segment: "holiday",
  },
  { kind: "divider" },
  {
    kind: "header",
    title: "บริหารจัดการหลักสูตร",
  },
  {
    title: "รายวิชาโรงเรียนสามัญ",
    icon: <MenuBookIcon />,
    segment: "curriculum-subject",
  },
  {
    title: "รายวิชาที่เปิดสอน",
    icon: <MenuBookIcon />,
    segment: "curriculum-subject-offered",
  },
  { kind: "divider" },
  {
    kind: "header",
    title: "ระบบตารางเรียนตารางสอน",
  },
  {
    title: "คาบเรียน",
    icon: <CalendarViewWeekIcon />,
    segment: "study-period",
  },
  {
    title: "อาคารเรียน",
    icon: <CalendarViewWeekIcon />,
    segment: "classroom-building",
  },
  {
    title: "ห้องเรียน",
    icon: <CalendarViewWeekIcon />,
    segment: "classroom",
  },
  {
    title: "โฮมรูมและกิจกรรมอื่นๆ",
    icon: <CalendarViewWeekIcon />,
    segment: "activity",
  },
  {
    title: "ตารางเรียนตารางสอน",
    icon: <CalendarViewWeekIcon />,
    segment: "timetable",
  },
  { kind: "divider" },
  {
    kind: "header",
    title: "ระบบลงทะเบียนเรียน",
  },
  {
    title: "ลงทะเบียนเรียนตามชั้นเรียน",
    icon: <AppRegistrationIcon />,
    segment: "enrollment-group",
  },
  {
    title: "ลงทะเบียน/เพิ่ม/ถอน รายบุคคล",
    icon: <AppRegistrationIcon />,
    segment: "enrollment-individual",
  },
];

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const { children } = props;

  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ logo: <div />, title: "HDS" }}
      theme={createTheme()}
      router={{
        navigate: (newUrl) => router.push(newUrl as string),
        pathname: pathname,
        searchParams: new URLSearchParams(),
      }}
    >
      <DashboardLayout
        slots={{ toolbarActions: () => <Button>Signout</Button> }}
        sx={{ backgroundColor: "#f3f3f3" }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
