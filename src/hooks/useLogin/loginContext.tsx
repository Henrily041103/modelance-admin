import { createContext, ReactNode, useState } from "react";

export type LoginObject = {
  username: string;
  jwtToken: string;
  avatar: string
};

type LoginContextProps = {
  loginObject?: LoginObject;
  login?: (username: string, jwtToken: string, avatar: string) => boolean;
  logout?: () => boolean;
};

export const LoginContext = createContext<LoginContextProps>({});

type LoginWrapperProps = {
  children?: ReactNode[] | ReactNode;
};

export default function LoginWrapper({ children }: LoginWrapperProps) {
  const [loginObj, setLoginObj] = useState<LoginObject | undefined>();

  const login = (username: string, jwtToken: string, avatar: string) => {
    setLoginObj({ username, jwtToken, avatar });
    return true;
  };

  const logout = () => {
    setLoginObj(undefined);
    return true;
  };

  return (
    <LoginContext.Provider value={{ loginObject: loginObj, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}
