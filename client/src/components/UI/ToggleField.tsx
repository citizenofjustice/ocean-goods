import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const ToggleField: React.FC<{
  inputType: string;
  inputId: string;
  title: string;
  name: string;
  onToggleChange: () => void;
  checked: boolean;
}> = ({ inputId, inputType, title, name, onToggleChange, checked }) => {
  const [isToggleActive, setIsToggleActive] = useState<boolean>(checked);

  const handleToggle = () => {
    setIsToggleActive((prev) => !prev);
    onToggleChange();
  };

  return (
    <div className="flex flex-col w-full">
      <p className="block mb-2 font-medium">{title}</p>
      <div className="flex">
        <label htmlFor={inputId} className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              id={inputId}
              name={name}
              type={inputType}
              defaultChecked={checked}
              onChange={handleToggle}
              className="peer sr-only"
            />
            <div className="block bg-background-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-background-0 w-6 h-6 rounded-full peer-checked:translate-x-full transition flex justify-center items-center">
              {isToggleActive ? (
                <CheckIcon className="w-4 h-4 text-text-700" />
              ) : (
                <XMarkIcon className="w-4 h-4 text-text-700" />
              )}
            </div>
          </div>
          <div className="ml-3 text-gray-700 font-medium"></div>
        </label>
        <p className="flex justify-center items-center">
          {isToggleActive ? "В наличии" : "Нет в наличии"}
        </p>
      </div>
    </div>
  );
};

export default ToggleField;
