import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleSubmit } from "./functions";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { useState } from "react";
import useLogin from "@/hooks/useLogin";

const loginFormSchema = zod.object({
  username: zod
    .string()
    .min(2, { message: "Username is between 2-50 characters" })
    .max(50, { message: "Username is between 2-50 characters" }),
  password: zod
    .string()
    .min(2, { message: "Password is between 2-50 characters" })
    .max(50, { message: "Password is between 2-50 characters" }),
});

export default function LoginPage() {
  const form = useForm<zod.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const { login } = useLogin();

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl login-title">
          Log in
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ username, password }) =>
              handleSubmit(
                navigate,
                username,
                password,
                setIncorrectLogin,
                login
              )
            )}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password..."
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {incorrectLogin && (
              <h3 className="font-semibold tracking-tight login-error">
                Username or password is not correct!
              </h3>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
