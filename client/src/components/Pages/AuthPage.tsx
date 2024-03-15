import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/form";
import { Input } from "../UI/input";
import { Button } from "../UI/button";
import { ButtonLoading } from "../UI/ButtonLoading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useStore } from "../../store/root-store-context";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import { Eye, EyeOff } from "lucide-react";
import { zodAuthUserForm } from "../../lib/zodAuthUserForm";

const AuthPage = observer(() => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const location = useLocation();
  const { auth, alert } = useStore();
  const { authData } = auth;
  const from = location.state?.from.pathname || "/";
  const axiosPrivate = useAxiosPrivate();

  // Define your form.
  const form = useForm<z.infer<typeof zodAuthUserForm>>({
    resolver: zodResolver(zodAuthUserForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof zodAuthUserForm>) {
    setIsPending(true);
    const fData = new FormData();
    fData.append("email", values.email);
    fData.append("password", values.password);
    try {
      const response = await axiosPrivate.post(`/login`, fData);
      const { user, accessToken, priveleges } = response.data;
      auth.setAuthData({
        ...authData,
        user,
        accessToken,
        priveleges,
      });
      form.reset();
      navigate(from, { replace: true });
    } catch (error) {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При входе в учетную запись произошла неизвестная ошибка",
          type: "error",
        });
    }
    setIsPending(false);
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <Card className="mt-[10vh] min-w-[200px] w-[400px] mx-4">
          <CardHeader>
            <CardTitle className="text-center">Авторизация</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="auth-user-email">
                        Эл. почта:
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="auth-user-email"
                          autoComplete="on"
                          placeholder="email@example.com"
                          {...field}
                        />
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
                      <FormLabel htmlFor="auth-user-password">
                        Пароль:
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="auth-user-password"
                            className="pr-10"
                            type={isPasswordShown ? "text" : "password"}
                            {...field}
                          />
                          {isPasswordShown ? (
                            <EyeOff
                              className="absolute top-[50%] translate-y-[-50%] right-2 w-5 h-5 hover:cursor-pointer"
                              onClick={() => setIsPasswordShown(false)}
                            />
                          ) : (
                            <Eye
                              className="absolute top-[50%] translate-y-[-50%] right-2 w-5 h-5 hover:cursor-pointer"
                              onClick={() => setIsPasswordShown(true)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isPending ? (
                    <ButtonLoading />
                  ) : (
                    <Button className="px-8" type="submit">
                      Войти
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
});

export default AuthPage;
