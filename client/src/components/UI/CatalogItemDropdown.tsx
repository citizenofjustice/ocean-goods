import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

const CatalogItemDropdown: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsShown(false));

  return (
    <>
      <div className="relative">
        <button
          className="flex text-sm hover:bg-gray-200 rounded-full p-1 h-fit"
          type="button"
          onClick={() => setIsShown(true)}
        >
          <span className="sr-only">Открыть меню пользователя</span>
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
        {isShown && (
          <div
            ref={dropdownRef}
            className="absolute top-0 left-[-5rem] w-28 z-10 bg-white border border-gray-200 rounded shadow-lg"
          >
            <div className="divide-y divide-solid divide-gray-200 text-sm text-gray-600">
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CatalogItemDropdown;
