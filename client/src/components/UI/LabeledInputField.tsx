import { useState } from "react";

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
      <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
        {title}
      </label>
      <input
        type={isPasswordShown ? "string" : inputType}
        id={inputId}
        name={name}
        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
