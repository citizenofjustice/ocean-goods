import SimpleSelect, { SelectOptions } from "./UI/SimpleSelect";

const SortComponent: React.FC<{
  sortOptions: SelectOptions[];
  selectedOption: string;
  handleSelect: (value: string) => void;
}> = ({ sortOptions, selectedOption, handleSelect }) => {
  return (
    <div className="flex lg:flex-col vsm:flex-row flex-col gap-2 items-center">
      <label className="align-middle h-fit basis-1/2 vsm:basis-2/5 lg:basis-1/2">
        Сортировать по:
      </label>
      <SimpleSelect
        options={sortOptions}
        selectedOption={selectedOption}
        onOptionSelect={handleSelect}
      />
    </div>
  );
};

export default SortComponent;
