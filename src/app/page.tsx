"use client";

import { Button, Grid2 as Grid } from "@mui/material";
import firebaseService from "../services/firebase";

export default function LoginPage() {
  return (
    <Grid
      container
      columns={{ md: 12, sm: 9, xs: 6 }}
      height={"100%"}
      sx={{ backgroundColor: "#f3f3f3" }}
    >
      <Grid
        container
        size={{ md: 4, sm: 5, xs: 4 }}
        offset={{ md: 4, sm: 2, xs: 1 }}
        spacing={2}
        alignSelf={"center"}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => firebaseService.login()}
        >
          Login With Google
        </Button>
      </Grid>
    </Grid>
  );
}
