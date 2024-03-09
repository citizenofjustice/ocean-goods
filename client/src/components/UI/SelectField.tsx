import { SelectValueProp } from "../../types/SelectValue";
import LoadingSpinner from "./LoadingSpinner";

const SelectField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  isLoading: boolean;
  isError: boolean;
  options: SelectValueProp[];
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
          <label htmlFor={inputId} className="block mb-2 font-medium">
            {title}
          </label>
          <div className="relative">
            <select
              name={name}
              id={inputId}
              onChange={onSelectChange}
              defaultValue={value}
              className="block appearance-none py-3 px-4 pr-8 rounded leading-tight w-full bg-white border border-gray-500 text-text-700
              focus:outline-none focus:bg-white focus:border-accent-700 focus:border-2
              hover:border-accent-700
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none"
              required
            >
              <option value="" disabled>
                {` Выберите ${title.toLowerCase()} `}
              </option>
              {options.length > 0 &&
                options.map((item) => (
                  <option key={item.id} className="text-black" value={item.id}>
                    {item.optionValue}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-6-6h12" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectField;
