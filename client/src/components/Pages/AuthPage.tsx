import { useState } from "react";
import DefaultButton from "../UI/DefaultButton";
import LabeledInputField from "../UI/LabeledInputField";
import FormCard from "../UI/FormCard";

const initValues = {
  email: "",
  password: "",
};

const AuthPage = () => {
  const [inputValues, setInputValues] = useState(initValues);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <FormCard>
          <form className="flex flex-col gap-4">
            <LabeledInputField
              inputId="auth-form-email"
              title="Электронная почта"
              name="email"
              inputType="email"
              value={inputValues.email}
              onInputChange={handleValueChange}
            />
            <LabeledInputField
              inputId="auth-form-password"
              title="Пароль"
              name="password"
              inputType="password"
              value={inputValues.password}
              onInputChange={handleValueChange}
            />
            <DefaultButton type="submit">Войти</DefaultButton>
          </form>
        </FormCard>
      </div>
    </>
  );
};

export default AuthPage;
