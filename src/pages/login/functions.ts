import { NavigateFunction } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

type LoginInput = {
  username: string;
  password: string;
};

type LoginOutput = {
  account: {
    id: string;
    username: string;
    fullName: string;
    role: {
      id: string;
      roleName: string;
    };
    avatar: string;
  };
  jwtToken: string;
  statusMessage: string;
};

export async function handleSubmit(
  navigate: NavigateFunction,
  username: string,
  password: string,
  setIncorrectLogin: (inc: boolean) => void,
  login: (username: string, jwtToken: string) => boolean
) {
  const request = await axios.post<
    LoginOutput,
    AxiosResponse<LoginOutput>,
    LoginInput
  >("https://modelance-backend-rfh7esctoa-uc.a.run.app/account/login", {
    username,
    password,
  });
  const result = request.data;
  if (
    result.account &&
    result.jwtToken &&
    result.account.role.roleName.toLowerCase() === "admin"
  ) {
    login(result.account.username, result.jwtToken);
    setIncorrectLogin(false);
    navigate("/console");
  } else {
    setIncorrectLogin(true);
  }
}
