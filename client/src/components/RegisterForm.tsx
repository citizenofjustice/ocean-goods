import { useRef, useState } from "react";
import FormCard from "./UI/FormCard";
import LabeledInputField from "./UI/LabeledInputField";
import DefaultButton from "./UI/DefaultButton";
import SelectField from "./UI/SelectField";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PasswordInputField from "./UI/PasswordInputField";

const initValues = {
  email: "",
  password: "",
  roleId: "",
};

const RegisterForm = () => {
  const [inputValues, setInputValues] = useState(initValues);
  const formRef = useRef<HTMLFormElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const [isPending, setIsPendind] = useState(false);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles-select"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/roles/select-values`);
      return response.data;
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
    const response = await axiosPrivate.post(`/users/register`, newUserData);
    setIsPendind(false);
    if (response.status === 201) {
      formRef.current?.reset();
      setInputValues(initValues);
    } else console.log(response);
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

          <DefaultButton type="submit" isPending={isPending}>
            Зарегистрировать
          </DefaultButton>
        </form>
      </FormCard>
    </>
  );
};

export default RegisterForm;
