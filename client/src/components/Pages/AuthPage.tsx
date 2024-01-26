import { useState } from "react";
import DefaultButton from "../UI/DefaultButton";
import LabeledInputField from "../UI/LabeledInputField";
import FormCard from "../UI/FormCard";
import { authUser } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/root-store-context";
import { observer } from "mobx-react-lite";

const initValues = {
  email: "",
  password: "",
};

const AuthPage = observer(() => {
  const [inputValues, setInputValues] = useState(initValues);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useStore();
  const { authData } = auth;
  const from = location.state?.from.pathname || "/";

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fData = new FormData(event.currentTarget);
    const result = await authUser(fData);
    if (result.status === 200) {
      const { user, accessToken, role } = result.data;

      auth.setAuthData({ ...authData, user, accessToken, roles: [role] });

      setInputValues(initValues);
      navigate(from, { replace: true });
    } else {
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
});

export default AuthPage;
