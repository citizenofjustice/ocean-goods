export interface SelectOptions {
  value: string;
  content: string;
}

const SimpleSelect: React.FC<{
  options: SelectOptions[];
  selectedOption: string;
  onOptionSelect: (value: string) => void;
}> = ({ options, selectedOption, onOptionSelect }) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative">
        <select
          value={selectedOption}
          onChange={(e) => onOptionSelect(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-accent-500 focus:border-2 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.content}
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
  );
};

export default SimpleSelect;
