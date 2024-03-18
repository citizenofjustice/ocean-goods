import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/UI/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/UI/shadcn/button";
import { useLocation, useNavigate } from "react-router-dom";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useStore } from "@/store/root-store-context";
import { zodAuthUserForm } from "@/lib/zodAuthUserForm";
import { ButtonLoading } from "@/components/UI/ButtonLoading";

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
      <div className="flex w-full justify-center">
        <Card className="mx-4 mt-[10vh] w-[400px] min-w-[200px]">
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
                              className="absolute right-2 top-[50%] h-5 w-5 translate-y-[-50%] hover:cursor-pointer"
                              onClick={() => setIsPasswordShown(false)}
                            />
                          ) : (
                            <Eye
                              className="absolute right-2 top-[50%] h-5 w-5 translate-y-[-50%] hover:cursor-pointer"
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
                    <Button
                      className="px-8"
                      type="submit"
                      aria-label="Войти в аккаунт"
                    >
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
