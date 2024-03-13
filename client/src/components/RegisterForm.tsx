import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { useStore } from "../store/root-store-context";
import { SelectValueProp } from "../types/SelectValue";
import { Button } from "./UI/button";
import { ButtonLoading } from "./UI/ButtonLoading";
import { Card, CardContent, CardHeader } from "./UI/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodRegisterUserForm } from "../lib/zodRegisterUserForm";
import { Input } from "./UI/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./UI/select";

interface RoleSelectOption {
  roleId: string;
  title: string;
}

const RegisterForm = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [isPending, setIsPendind] = useState(false);
  const { alert } = useStore();
  const form = useForm<z.infer<typeof zodRegisterUserForm>>({
    resolver: zodResolver(zodRegisterUserForm),
    defaultValues: {
      roleId: "",
      email: "",
      password: "",
    },
  });

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles-select"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/roles/select-values`);
      if (response instanceof AxiosError) {
        throw new Error("Error while fetching roles select-values");
      } else {
        const availableRoles = response.data.map((item: RoleSelectOption) => {
          const selectValue: SelectValueProp = {
            id: String(item.roleId),
            optionValue: item.title,
          };
          return selectValue;
        });
        return availableRoles;
      }
    },
    refetchOnWindowFocus: false,
  });

  async function onSubmit(values: z.infer<typeof zodRegisterUserForm>) {
    setIsPendind(true);
    try {
      const fData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        fData.append(key, value);
      }
      await axiosPrivate.post(`/users/register`, fData);
      form.reset();
      alert.setPopup({
        message: "Учетная запись успешно зарегистрирована",
        type: "success",
      });
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
    setIsPendind(false);
  }

  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <Card className="w-full mt-4">
        <CardHeader>
          <p className="font-medium text-center">Регистрация пользователя:</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Роль пользователя:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoading ? (
                                <Loader2 className="w-4 h-4" />
                              ) : (
                                "Выберите подходящую роль"
                              )
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      {!isLoading && !isError && (
                        <SelectContent>
                          {data.map((item: SelectValueProp) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.optionValue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="register-user-email">
                      Эл. почта:
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="register-user-email"
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
                    <FormLabel htmlFor="register-user-password">
                      Пароль:
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="register-user-password"
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
              {isPending ? (
                <ButtonLoading />
              ) : (
                <Button>Зарегистрировать</Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default RegisterForm;
