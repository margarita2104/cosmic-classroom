import { AxiosCosmicClassroom } from "../../axios/Axios";
import { login_user } from "../../store/slices/UserSlice";
import { AxiosError } from "axios"; 

const LoginSubmitHandler = async (
  email: string,
  password: string,
  setError: (error: string) => void,
  dispatch: any,
  router: any
) => {
  try {
    const response = await AxiosCosmicClassroom.post("/auth/token/", {
      email,
      password,
    });

    const accessToken = response.data.access;

    localStorage.setItem("accessToken", accessToken);
    dispatch(login_user(accessToken));

    await AxiosCosmicClassroom.get("/user/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    router.push("/dashboard");
  } catch (error) {
    if (error instanceof AxiosError) {
      setError(error.response?.data?.detail || "An error occurred");
    } else {
      setError("An unexpected error occurred");
    }
  }
};

export default LoginSubmitHandler;

