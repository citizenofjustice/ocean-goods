const SelectField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ inputId, title, name, onSelectChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
        {title}
      </label>
      <select
        name={name}
        id={inputId}
        onChange={onSelectChange}
        defaultValue={""}
        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
      >
        <option value="" disabled>
          --- Выберите тип ---
        </option>
        <option className="text-black" value="1">
          Рыба
        </option>
        <option className="text-black" value="2">
          Мясо
        </option>
      </select>
    </div>
  );
};

export default SelectField;
