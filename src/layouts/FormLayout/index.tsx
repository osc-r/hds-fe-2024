import { Container, Grid2 as Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

type FormLayoutProps = PropsWithChildren & {
  title: string;
};

export default function FormLayout(props: FormLayoutProps) {
  return (
    <Container maxWidth="lg" sx={{ height: "100%", padding: 4 }}>
      <Grid container spacing={2}>
        <Grid
          size={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={{ sm: 2, xs: 1 }}
        >
          <Typography sx={{ typography: { sm: "h5", xs: "h6" } }}>
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
