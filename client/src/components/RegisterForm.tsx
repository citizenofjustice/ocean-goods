import { useState } from "react";
import FormCard from "./UI/FormCard";
import LabeledInputField from "./UI/LabeledInputField";
import DefaultButton from "./UI/DefaultButton";
import SelectField from "./UI/SelectField";
import { useQuery } from "@tanstack/react-query";
import { getRolesSelectValues } from "../api";

const initValues = {
  email: "",
  password: "",
  roleId: "",
};

const RegisterForm = () => {
  const [inputValues, setInputValues] = useState(initValues);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles-select"],
    queryFn: async () => await getRolesSelectValues(),
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

  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <FormCard>
        <form className="flex flex-col gap-4">
          <SelectField
            title="Роль пользователя"
            inputId="register-form-role"
            name="productTypeId"
            onSelectChange={handleSelectChange}
            value={inputValues.roleId}
            isLoading={isLoading}
            isError={isError}
            options={data}
          />
          <LabeledInputField
            inputId="register-form--email"
            title="Электронная почта"
            name="email"
            inputType="email"
            value={inputValues.email}
            onInputChange={handleValueChange}
          />
          <LabeledInputField
            inputId="register-form--password"
            title="Пароль"
            name="password"
            inputType="password"
            value={inputValues.password}
            onInputChange={handleValueChange}
          />

          <DefaultButton type="submit">Зарегистрировать</DefaultButton>
        </form>
      </FormCard>
    </>
  );
};

export default RegisterForm;
