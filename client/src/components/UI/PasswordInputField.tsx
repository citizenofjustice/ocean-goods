import { useState } from "react";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none hover:border-accent-700 empty:border-gray-500 empty:ring-gray-300`;

const PasswordInputField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  value: string | number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attr?: React.InputHTMLAttributes<HTMLInputElement>;
}> = ({ inputId, title, name, value, onInputChange, attr }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
    const password = e.target.value;
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /\W/.test(password);
    const hasNonEnglishCharacters = /[^A-Za-z0-9]/.test(password);

    if (password.length < 8) {
      setPasswordError("Пароль должен содержать не менее 8 символов");
    } else if (!hasNumber) {
      setPasswordError("Пароль должен содержать хотя бы одну цифру");
    } else if (!hasLowercase) {
      setPasswordError("Пароль должен содержать хотя бы одну строчную букву");
    } else if (!hasUppercase) {
      setPasswordError("Пароль должен содержать хотя бы одну заглавную букву");
    } else if (!hasSymbol) {
      setPasswordError("Пароль должен содержать хотя бы один символ");
    } else if (hasNonEnglishCharacters) {
      setPasswordError("Пароль должен содержать только латинские буквы");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 font-medium">
        {title}
      </label>
      <input
        type={isPasswordShown ? "string" : "password"}
        id={inputId}
        name={name}
        className={`${
          passwordError
            ? "focus:outline-none border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : inputStyles
        }  appearance-none text-text-700 py-3 px-4 rounded leading-tight truncate border block w-full`}
        placeholder={title}
        value={value}
        onChange={handleInputChange}
        {...attr}
        required
      />
      {passwordError && <p className="text-red-500">{passwordError}</p>}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className={`w-6 h-6 border border-black rounded ${
            isPasswordShown ? "bg-primary-600" : "bg-background-0"
          } text-text-50 font-bold text-sm`}
          type="button"
          onClick={() => setIsPasswordShown((prevValue) => !prevValue)}
        >
          {isPasswordShown ? "\u2713" : ""}
        </button>
        <p>Показать пароль</p>
      </div>
    </div>
  );
};

export default PasswordInputField;
