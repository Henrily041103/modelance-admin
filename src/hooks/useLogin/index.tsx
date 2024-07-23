import { useContext } from "react";
import { LoginContext, LoginObject } from "./loginContext";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "axios";
import axios from "axios";

type LoginHookResults = {
  loginObject: LoginObject;
  login: (username: string, jwtToken: string, avatar: string) => boolean;
  logout: () => boolean;
  axios: AxiosInstance;
};

export default function useLogin() {
  const loginContext = useContext(LoginContext);
  const navigate = useNavigate();
  const instance = axios.create({
    baseURL: "https://modelance-backend-rfh7esctoa-uc.a.run.app/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (loginContext.loginObject) {
    const token = loginContext.loginObject.jwtToken;
    // Request interceptor to add the token to the headers
    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle 401 errors
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
  }

  const loginResults: LoginHookResults = {
    login: loginContext.login!,
    logout: () => {
      const result = loginContext.logout!();
      navigate("/");
      return result;
    },
    loginObject: loginContext.loginObject!,
    axios: instance,
  };

  return loginResults;
}
