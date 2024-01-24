import { useState } from "react";
import DefaultButton from "../UI/DefaultButton";
import LabeledInputField from "../UI/LabeledInputField";
import FormCard from "../UI/FormCard";
import { authUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/root-store-context";

const initValues = {
  email: "",
  password: "",
};

const AuthPage = () => {
  const [inputValues, setInputValues] = useState(initValues);
  const navigate = useNavigate();
  const { auth } = useStore();
  const { authData } = auth;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fData = new FormData(event.currentTarget);
    const result = await authUser(fData);
    if (result.status === 200) {
      const accessToken = result?.data.accessToken;
      // const role = result?.data.roleId;
      auth.setAuthData({ ...authData, accessToken: accessToken });

      setInputValues(initValues);
      navigate("/dashboard");
    } else {
      console.log("handleLogin else: ");
      console.log(result.response.data);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <FormCard>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
