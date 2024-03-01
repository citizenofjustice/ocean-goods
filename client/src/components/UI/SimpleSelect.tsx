import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface SelectOptions {
  value: string;
  content: string;
}

const SimpleSelect: React.FC<{
  options: SelectOptions[];
  selectedOption: string;
  onOptionSelect: (value: string) => void;
  placeholder?: string;
  groupLabel?: string;
  size?: "normal" | "small";
}> = ({
  options,
  selectedOption,
  onOptionSelect,
  placeholder,
  groupLabel,
  size = "normal",
}) => {
  const isSmall = size === "small";

  return (
    <Select
      value={selectedOption}
      onValueChange={(value) => onOptionSelect(value)}
    >
      <SelectTrigger className={isSmall ? "w-10" : "w-36"}>
        {isSmall ? "" : <SelectValue placeholder={placeholder} />}
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.content}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    // <div className="basis-1/2 vsm:basis-3/5 lg:basis-1/2">
    //   <div className="relative">
    //     <select
    //       value={selectedOption}
    //       onChange={(e) => onOptionSelect(e.target.value)}
    //       className="block appearance-none py-2.5 px-4 pr-8 rounded leading-tight w-full bg-white border border-gray-300 text-text-700
    //       focus:outline-none focus:bg-white focus:border-accent-700 focus:border-2
    //       hover:border-accent-700
    //       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none"
    //     >
    //       {options.map((option, index) => (
    //         <option key={index} value={option.value}>
    //           {option.content}
    //         </option>
    //       ))}
    //     </select>
    //     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    //       <svg
    //         className="fill-current h-4 w-4"
    //         xmlns="http://www.w3.org/2000/svg"
    //         viewBox="0 0 20 20"
    //       >
    //         <path d="M10 12l-6-6h12" />
    //       </svg>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SimpleSelect;
