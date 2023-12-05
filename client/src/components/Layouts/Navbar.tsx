import { useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Cart from "../Cart";
import MenuList from "../MenuList";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const isNotEmpty: boolean = true; // temp value for cart highligth
  const tablet = useMediaQuery("(min-width: 768px)"); // media query for conditional rendering of navbar

  // additional classes for menu & cart wrappers
  const menuClasses: string =
    "w-full h-full fixed z-10 bg-white top-0 left-0 transition-all duration-300 ease-in-out";

  return (
    <header className="sticky top-0 bg-white border-b-2 flex flex-row p-4">
      <nav className="basis-1/12">
        {isMenuOpen && (
          <div className={menuClasses}>
            <MenuList
              menuItems={menuItems}
              onMenuClose={() => setIsMenuOpen(false)}
            />
          </div>
        )}
        {!tablet ? (
          // if screen width smaller than tablets show mobile menu icon
          <div
            onClick={() => setIsMenuOpen(true)}
            className="w-6 h-6 hover:cursor-pointer"
          >
            <Bars3Icon className="w-6 h-6" />
          </div>
        ) : (
          // if screen width bigger than tablets show app name
          <div className="whitespace-nowrap">
            <Link to="/">Ocean Goods</Link>
          </div>
        )}
      </nav>
      <div className="basis-10/12 flex justify-center">
        {!tablet ? (
          // if screen width smaller than tablets show app name
          <Link to="/">Ocean Goods</Link>
        ) : (
          // if screen width smaller than tablets show desktop menu
          <MenuList menuItems={menuItems} isDesktop />
        )}
      </div>
      <div className="basis-1/12 flex justify-end w-6 h-6 hover:cursor-pointer">
        {isCartOpen && (
          <div className={`overflow-auto ${menuClasses}`}>
            <Cart onCartClose={() => setIsCartOpen(false)} />
          </div>
        )}
        <div onClick={() => setIsCartOpen(true)}>
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
        {/* small highlight if cart is not empty */}
        {isNotEmpty && (
          <div className="relative left-[-4px] bg-red-500 rounded-full min-w-[8px] min-h-[8px] w-[8px] h-[8px]" />
        )}
      </div>
    </header>
  );
};

export default Navbar;
