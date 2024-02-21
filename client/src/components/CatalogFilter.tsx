import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 hover:border-accent-700
disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500`;

const CatalogFilter: React.FC<{
  filterBy: string;
  handleFilterInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ filterBy, handleFilterInput }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="relative">
        <input
          id="catalog-filter"
          name="filter"
          type="text"
          className={`${inputStyles} appearance-none text-text-700 py-3 px-4 rounded leading-tight truncate h-fit border border-gray-300 block py-2.5 pl-2.5 pr-8 max-w-[190px]`}
          placeholder="Введите название..."
          value={filterBy}
          onChange={handleFilterInput}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <MagnifyingGlassIcon className="w-6 h-6 text-primary-700 opacity-70" />
        </div>
      </div>
    </div>
  );
};

export default CatalogFilter;
