const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 focus:empty:border-accent-700 focus:empty:ring-accent-700
  invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
  hover:border-accent-700 empty:border-gray-500 empty:ring-gray-300`;

const TextareaField: React.FC<{
  title: string;
  inputId: string;
  name: string;
  value: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ title, inputId, name, value, onInputChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={inputId} className="block mb-2 font-medium">
        {title}
      </label>
      <textarea
        name={name}
        value={value}
        className={`${inputStyles} text-text-700 py-3 px-4 rounded leading-tight border border-gray-500 block w-full h-44 max-h-44 resize-none`}
        id={inputId}
        rows={8}
        placeholder="Описание продукта"
        onChange={onInputChange}
      />
    </div>
  );
};

export default TextareaField;
