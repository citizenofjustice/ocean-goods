import { useState } from "react";
import { Privelege } from "../../types/Privelege";

const CustomRadioButton: React.FC<{
  buttonData: Privelege;
  onChange: (id: number, isActive: boolean) => void;
}> = ({ buttonData, onChange }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleValueChange = () => {
    console.log("1: ", isActive);

    setIsActive((prevValue) => !prevValue);
    console.log("2: ", isActive);

    onChange(buttonData.privelegeId, isActive);
  };

  return (
    <>
      <div className="flex gap-2 p-2">
        <div
          onClick={handleValueChange}
          className="w-6 h-6 border-2 border-neutral-700 bg-white rounded-full hover:cursor-pointer flex justify-center items-center"
        >
          {isActive && <div className="w-4 h-4 bg-blue-700 rounded-full"></div>}
        </div>
        <div>{buttonData.title}</div>
      </div>
    </>
  );
};

export default CustomRadioButton;
