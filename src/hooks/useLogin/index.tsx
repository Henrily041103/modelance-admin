import { useContext } from "react";
import { LoginContext, LoginObject } from "./loginContext";
type LoginHookResults = {
  loginObject: LoginObject;
  login: (username: string, jwtToken: string) => boolean;
  logout: () => boolean;
};

export default function useLogin() {
  const loginContext = useContext(LoginContext);

  const loginResults: LoginHookResults = {
    login: loginContext.login!,
    logout: loginContext.logout!,
    loginObject: loginContext.loginObject!,
  };

  return loginResults;
}
