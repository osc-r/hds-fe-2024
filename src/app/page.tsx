"use client";

import { Button, Grid2 as Grid } from "@mui/material";
// import { useMutation } from "@tanstack/react-query";
// import { authService } from "../services";
import { useRouter } from "next/navigation";
import firebaseService from "../services/firebase";
import { User } from "firebase/auth";
import { useUserStore } from "../stores/user.store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  // const { mutate } = useMutation<
  //   unknown,
  //   unknown,
  //   {
  //     email: string;
  //     password: string;
  //   }
  // >({
  //   mutationKey: ["login"],
  //   mutationFn: ({ email, password }) =>
  //     authService.login(email, password).then((res) => res.data),
  // });

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
          onClick={async () => {
            const result = await firebaseService.login();
            if (result.success && result.payload) {
              const user = result.payload.user as User & {
                accessToken: string;
              };
              setUser({ accessToken: user.accessToken });
              // optionService.getDegreeOptions().then((res) => console.log(res));
              router.push("/academic-calendar");
            }
            return result;
          }}
        >
          Login With Google
        </Button>
      </Grid>
    </Grid>
  );
}
