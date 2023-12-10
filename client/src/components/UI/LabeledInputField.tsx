const LabeledInputField: React.FC<{
  inputId: string;
  title: string;
  name: string;
  inputType: string;
  value: string | number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ inputId, title, inputType, name, value, onInputChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
        {title}
      </label>
      <input
        type={inputType}
        id={inputId}
        name={name}
        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={title}
        value={value}
        onChange={onInputChange}
        required
      />
    </div>
  );
};

export default LabeledInputField;
