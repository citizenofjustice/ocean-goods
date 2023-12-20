import { useState } from "react";

const ToggleField: React.FC<{
  inputType: string;
  inputId: string;
  title: string;
  name: string;
  onToggleChange: () => void;
  checked: boolean;
}> = ({ inputId, inputType, title, name, onToggleChange, checked }) => {
  const [isToggleActive, setIsToggleActive] = useState<boolean>(false);

  const handleToggle = () => {
    setIsToggleActive((prev) => !prev);
    onToggleChange();
  };

  return (
    <div className="flex flex-col w-full">
      <p className="block mb-2 text-sm font-medium">{title}</p>
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
            <div className="block bg-gray-400 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full peer-checked:translate-x-full peer-checked:bg-blue-700 transition"></div>
          </div>
          <div className="ml-3 text-gray-700 font-medium"></div>
        </label>
        <p className="ml-6">{isToggleActive ? "В наличии" : "Нет в наличии"}</p>
      </div>
    </div>
  );
};

export default ToggleField;
