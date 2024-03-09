import { ArrowDown, ArrowUp, ArrowUpDownIcon } from "lucide-react";

export const SortArrowsIcons: React.FC<{
  isActive: boolean;
  sortDirection: "asc" | "desc";
}> = ({ isActive, sortDirection }) => {
  return (
    <>
      {isActive ? (
        <>
          {sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </>
      ) : (
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      )}
    </>
  );
};
