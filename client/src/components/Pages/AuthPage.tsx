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
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/ButtonLoading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useStore } from "../../store/root-store-context";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AuthPage = observer(() => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const location = useLocation();
  const { auth, alert } = useStore();
  const { authData } = auth;
  const from = location.state?.from.pathname || "/";
  const axiosPrivate = useAxiosPrivate();

  const formSchema = z.object({
    email: z.string().email("Неверная электонная почта"),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    // Disabled temporarily
    // password: z.string().refine(
    //   (password) => {
    //     const hasSymbol = /\W/.test(password);
    //     const hasNumber = /\d/.test(password);
    //     const hasUppercase = /[A-Z]/.test(password);
    //     const hasLowercase = /[a-z]/.test(password);

    //     return hasSymbol && hasNumber && hasUppercase && hasLowercase;
    //   },
    //   {
    //     message:
    //       "Пароль должен состоять из букв верхнего и нижнего регисторв латинского алфавита, цифр и символов",
    //   }
    // ),
  });

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const fData = new FormData();
    fData.append("email", values.email);
    fData.append("password", values.password);
    try {
      const response = await axiosPrivate.post(`/login`, fData);
      const { user, accessToken, role } = response.data;
      auth.setAuthData({ ...authData, user, accessToken, roles: [role] });
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
                      <FormLabel>Эл. почта:</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
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
                      <FormLabel>Пароль:</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
