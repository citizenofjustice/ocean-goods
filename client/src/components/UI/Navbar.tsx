import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import MenuList from "./MenuList";

// defining menuItem interface
export interface menuItem {
  title: string;
  path: string;
  icon?: JSX.Element;
}
// setting menuItems with values
const menuItems: menuItem[] = [
  {
    title: "Каталог",
    path: "/",
  },
  {
    title: "Поиск",
    path: "/search",
    icon: <MagnifyingGlassIcon className="w-4 h-4" />,
  },
  {
    title: "Контакты",
    path: "/contact",
    icon: <PhoneIcon className="w-4 h-4" />,
  },
];

/**
 * Component for rendering header and navigation
 * @returns
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuClasses: string =
    "absolute z-10 bg-white w-full h-full top-0 left-0 transition-all duration-300 ease-in-out";

  return (
    <header className="flex flex-row p-4">
      <nav className="basis-1/12">
        <div
          className={`${isMenuOpen ? `top-0` : `top-[-1000px]`} ${menuClasses}`}
        >
          <MenuList
            menuItems={menuItems}
            onMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
        <div
          onClick={() => setIsMenuOpen(true)}
          className="w-6 h-6 hover:cursor-pointer"
        >
          <Bars3Icon className="w-6 h-6" />
        </div>
      </nav>
      <div className="basis-10/12 text-center">
        <Link to="/">Ocean Goods</Link>
      </div>
      <div className="basis-1/12 flex justify-end w-6 h-6 hover:cursor-pointer">
        <ShoppingCartIcon className="h-6 w-6" />
      </div>
    </header>
  );
};

export default Navbar;
