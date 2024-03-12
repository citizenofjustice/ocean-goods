import { z } from "zod";

export const zodRegisterUserForm = z.object({
  roleId: z.string().min(1, { message: "Выберите роль" }),
  email: z.string().email("Неверная электонная почта"),
  password: z.string().refine(
    (password) => {
      const hasSymbol = /\W/.test(password);
      const hasNumber = /\d/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);

      return hasSymbol && hasNumber && hasUppercase && hasLowercase;
    },
    {
      message:
        "Пароль должен состоять из букв верхнего и нижнего регисторв латинского алфавита, цифр и символов",
    }
  ),
});
