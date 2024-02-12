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
          className="flex text-sm hover:bg-background-300 rounded-full p-1 h-fit text-text-600 hover:text-text-50"
          type="button"
          onClick={() => setIsShown(true)}
        >
          <span className="sr-only">Открыть меню пользователя</span>
          <EllipsisHorizontalIcon className="h-6 w-6 " />
        </button>
        {isShown && (
          <div
            ref={dropdownRef}
            className="absolute drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] top-0 left-[-5rem] w-28 z-10 bg-white border border-gray-200 rounded shadow-lg"
          >
            <div className="divide-y divide-solid divide-gray-200 text-sm font-medium text-gray-800">
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CatalogItemDropdown;
