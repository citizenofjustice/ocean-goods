import { useState } from "react";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 focus:empty:border-accent-700 focus:empty:ring-accent-700
  invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
  hover:border-accent-700 empty:border-gray-500 empty:ring-gray-300`;

const LabeledInputField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  inputType: string;
  value: string | number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attr?: React.InputHTMLAttributes<HTMLInputElement>;
}> = ({ inputId, title, inputType, name, value, onInputChange, attr }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isPasswordField = inputType === "password";

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 font-medium">
        {title}
      </label>
      <input
        type={isPasswordShown ? "string" : inputType}
        id={inputId}
        name={name}
        className={`${inputStyles} appearance-none text-text-700 py-3 px-4 rounded leading-tight truncate border border-gray-500 block w-full`}
        placeholder={title}
        value={value}
        onChange={onInputChange}
        {...attr}
        required
      />
      {isPasswordField && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="w-6 h-6 border border-black rounded font-bold"
            type="button"
            onClick={() => setIsPasswordShown((prevValue) => !prevValue)}
          >
            {isPasswordShown ? "\u2713" : ""}
          </button>
          <p>Показать пароль</p>
        </div>
      )}
    </div>
  );
};

export default LabeledInputField;
