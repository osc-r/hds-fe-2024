"use client";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { createTheme } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// import { PageContainer } from "@toolpad/core";

const NAVIGATION: Navigation = [
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
  // {
  //   title: "รายวิชาที่เปิดสอน",
  //   icon: <MenuBookIcon />,
  //   segment: "curriculum-subject-offered",
  // },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ logo: <div></div>, title: "HDS" }}
      theme={createTheme()}
    >
      <DashboardLayout
        slots={{ toolbarActions: () => null }}
        sx={{ backgroundColor: "#f3f3f3" }}
      >
        {children}
        {/* <Grid container spacing={1}>
            <Grid size={5} />
          </Grid> */}
      </DashboardLayout>
    </AppProvider>
  );
}
