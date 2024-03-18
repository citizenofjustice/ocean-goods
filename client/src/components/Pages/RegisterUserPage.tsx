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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/shadcn/select";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/UI/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/UI/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/UI/shadcn/card";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useStore } from "@/store/root-store-context";
import { SelectValueProp } from "@/types/SelectValue";
import { ButtonLoading } from "@/components/UI/ButtonLoading";
import { zodRegisterUserForm } from "@/lib/zodRegisterUserForm";

interface RoleSelectOption {
  roleId: string;
  title: string;
}

const RegisterUserPage = () => {
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
      <Card className="mt-4 w-full">
        <CardHeader>
          <p className="text-center font-medium">Регистрация пользователя:</p>
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
                                <Loader2 className="h-4 w-4" />
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
              <div className="text-center">
                {isPending ? (
                  <ButtonLoading />
                ) : (
                  <Button aria-label="Зарегистрировать пользователя">
                    Зарегистрировать
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default RegisterUserPage;
