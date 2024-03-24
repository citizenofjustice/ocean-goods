import { ChevronDownCircle, Search } from "lucide-react";
import { Input } from "./UI/shadcn/input";
import SimpleSelect, { SelectOptions } from "./UI/SimpleSelect";
import { SortBy } from "@/types/SortBy";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface SortSelectOption extends SelectOptions {
  dbField: string;
  direction: "asc" | "desc";
}

// Options for sorting
const sortOptions: SortSelectOption[] = [
  {
    value: "productNameUp",
    dbField: "productName",
    content: "по названию (возр.)",
    direction: "asc",
  },
  {
    value: "productNameDown",
    dbField: "productName",
    content: "по названию (убыв.)",
    direction: "desc",
  },
  {
    value: "createdAtUp",
    dbField: "createdAt",
    content: "по дате (возр.)",
    direction: "asc",
  },
  {
    value: "createdAtDown",
    dbField: "createdAt",
    content: "по дате (убыв.)",
    direction: "desc",
  },
  {
    value: "finalPriceUp",
    dbField: "finalPrice",
    content: "по цене (возр.)",
    direction: "asc",
  },
  {
    value: "finalPriceDown",
    dbField: "finalPrice",
    content: "по цене (убыв.)",
    direction: "desc",
  },
];

const CatalogPageFilter: React.FC<{
  sortBy: SortBy;
  setSortBy: (sortOption: SortBy) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
}> = ({ setSortBy, filterBy, setFilterBy }) => {
  const [isFiltersShown, setIsFiltersShown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("createdAtDown");
  const queryClient = useQueryClient();
  const filtersRef = useRef<HTMLDivElement>(null);

  // Handler for select change
  const handleSelect = async (value: string) => {
    setSelectedOption(value);
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    const option = sortOptions.find((item) => item.value === value);
    if (!option) throw new Error("Could not find seleted option");
    setSortBy({ orderBy: option.dbField, direction: option.direction });
  };

  return (
    <div className="mb-4">
      <span
        className="mb-2 mt-4 flex items-center justify-center gap-2 text-center text-gray-500 transition delay-150 ease-in-out hover:cursor-pointer"
        onClick={() => setIsFiltersShown((prevVal) => !prevVal)}
      >
        <ChevronDownCircle
          className={`transition-transform duration-300 ${
            isFiltersShown ? "rotate-180" : ""
          }`}
        />
        Показать фильтр
      </span>
      <div
        className="overflow-y-hidden transition-all duration-300"
        style={{
          height: isFiltersShown ? filtersRef.current?.offsetHeight || 0 : 0,
        }}
      >
        <div
          className="grid grid-cols-1 items-center gap-0 vsm:grid-cols-2 vsm:gap-4 "
          ref={filtersRef}
        >
          <div className="relative flex items-center justify-start p-2">
            <Input
              placeholder={`Поиск по названию`}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="max-w-[260px] pr-8"
            />
            <Search className="absolute right-4 top-[50%] h-5 w-5 translate-y-[-50%]" />
          </div>
          <div className="flex flex-col items-center justify-start gap-2 p-2 vvsm:flex-row">
            <p className="text-sm font-medium">Сортировка:</p>
            <SimpleSelect
              options={sortOptions}
              placeholder="Сортировать по"
              selectedOption={selectedOption}
              onOptionSelect={handleSelect}
              ariaLabel="Сортировка каталога"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPageFilter;
