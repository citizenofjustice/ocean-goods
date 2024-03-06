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
  );
};

export default SimpleSelect;
