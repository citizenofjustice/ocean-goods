import { useState } from "react";
import LabeledInputField from "../ui/LabeledInputField";
import FormCard from "../ui/FormCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/root-store-context";
import { observer } from "mobx-react-lite";
import PasswordInputField from "../ui/PasswordInputField";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/ButtonLoading";

const initValues = {
  email: "",
  password: "",
};

const AuthPage = observer(() => {
  const [inputValues, setInputValues] = useState(initValues);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const location = useLocation();
  const { auth, alert } = useStore();
  const { authData } = auth;
  const from = location.state?.from.pathname || "/";
  const axiosPrivate = useAxiosPrivate();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const fData = new FormData(event.currentTarget);
    try {
      const response = await axiosPrivate.post(`/login`, fData);
      const { user, accessToken, role } = response.data;
      auth.setAuthData({ ...authData, user, accessToken, roles: [role] });
      setInputValues(initValues);
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
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[60vh]">
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
            <PasswordInputField
              inputId="auth-form-password"
              title="Пароль"
              name="password"
              value={inputValues.password}
              onInputChange={handleValueChange}
            />
            {isPending ? (
              <ButtonLoading />
            ) : (
              <Button type="submit">Cохранить</Button>
            )}
          </form>
        </FormCard>
      </div>
    </>
  );
});

export default AuthPage;
