import { SelectValue } from "../../types/SelectValue";
import LoadingSpinner from "./LoadingSpinner";

const SelectField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  isLoading: boolean;
  isError: boolean;
  options: SelectValue[];
}> = ({
  inputId,
  title,
  name,
  onSelectChange,
  value = "",
  isLoading,
  isError,
  options,
}) => {
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <div className="flex flex-col w-full">
          <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
            {title}
          </label>
          <select
            name={name}
            id={inputId}
            onChange={onSelectChange}
            defaultValue={value}
            className="lowercase border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="" disabled>
              {`--- Выберите ${title} ---`}
            </option>
            {options.map((item) => (
              <option key={item.id} className="text-black" value={item.id}>
                {item.optionValue}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default SelectField;
