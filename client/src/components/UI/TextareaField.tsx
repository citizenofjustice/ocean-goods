const TextareaField: React.FC<{
  title: string;
  inputId: string;
  name: string;
  value: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ title, inputId, name, value, onInputChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
        {title}
      </label>
      <textarea
        name={name}
        value={value}
        className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-44 max-h-44 resize-none"
        id={inputId}
        rows={8}
        placeholder="Описание продукта"
        onChange={onInputChange}
      />
    </div>
  );
};

export default TextareaField;
