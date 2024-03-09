import { useRef, useState } from "react";
import FormCard from "./UI/FormCard";
import LabeledInputField from "./UI/LabeledInputField";
import SelectField from "./UI/SelectField";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PasswordInputField from "./UI/PasswordInputField";
import { AxiosError } from "axios";
import { useStore } from "../store/root-store-context";
import { SelectValueProp } from "../types/SelectValue";
import { Button } from "./UI/button";
import { ButtonLoading } from "./UI/ButtonLoading";

const initValues = {
  email: "",
  password: "",
  roleId: "",
};

interface RoleSelectOption {
  roleId: number;
  title: string;
}

const RegisterForm = () => {
  const [inputValues, setInputValues] = useState(initValues);
  const formRef = useRef<HTMLFormElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const [isPending, setIsPendind] = useState(false);
  const { alert } = useStore();

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

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleRegisterFormSubmission = async (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    setIsPendind(true);
    const newUserData = new FormData(event.currentTarget);
    try {
      await axiosPrivate.post(`/users/register`, newUserData);
      formRef.current?.reset();
      setInputValues(initValues);
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
  };

  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <FormCard>
        <form
          ref={formRef}
          onSubmit={handleRegisterFormSubmission}
          className="flex flex-col gap-4"
        >
          <SelectField
            title="Роль пользователя"
            inputId="register-form-role"
            name="roleId"
            onSelectChange={handleSelectChange}
            value={inputValues.roleId}
            isLoading={isLoading}
            isError={isError}
            options={data}
          />
          <LabeledInputField
            inputId="register-form-email"
            title="Электронная почта"
            name="email"
            inputType="email"
            value={inputValues.email}
            onInputChange={handleValueChange}
          />
          <PasswordInputField
            inputId="register-form-password"
            title="Пароль"
            name="password"
            value={inputValues.password}
            onInputChange={handleValueChange}
          />
          {isPending ? <ButtonLoading /> : <Button>Зарегистрировать</Button>}
        </form>
      </FormCard>
    </>
  );
};

export default RegisterForm;
