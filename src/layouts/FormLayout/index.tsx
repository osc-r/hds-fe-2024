import {
  Container,
  Grid2 as Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

type FormLayoutProps = PropsWithChildren & {
  title: string;
};

export default function FormLayout(props: FormLayoutProps) {
  const router = useRouter();
  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Grid container spacing={2}>
        <Grid
          size={12}
          display={"flex"}
          alignItems={"center"}
          mb={{ sm: 2, xs: 1 }}
        >
          <IconButton color="primary" onClick={router.back}>
            <ArrowLeftIcon />
          </IconButton>
          <Typography sx={{ typography: { sm: "h5", xs: "h6" }, ml: 2 }}>
            {props.title}
          </Typography>
        </Grid>
        <Grid
          size={12}
          sx={{
            flex: 1,
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          {props.children}
        </Grid>
      </Grid>
    </Container>
  );
}
