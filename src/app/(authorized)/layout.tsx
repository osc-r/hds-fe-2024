"use client";

import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Button, createTheme } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { usePathname, useRouter } from "next/navigation";

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
  {
    title: "รายวิชาที่เปิดสอน",
    icon: <MenuBookIcon />,
    segment: "curriculum-subject-offered",
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
