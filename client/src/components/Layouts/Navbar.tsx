import { nanoid } from "nanoid";
import { useState } from "react";
import {
  Bars3Icon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  PhoneIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Cart from "../Cart";
import MenuList from "../MenuList";
import { MenuItem } from "../../types/MenuItem";
import { useStore } from "../../store/root-store-context";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { logoutUser } from "../../api";

// setting menuItems with values
const menuItems: MenuItem[] = [
  {
    id: nanoid(),
    title: "Каталог",
    path: "/",
    icon: <Squares2X2Icon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Поиск",
    path: "/search",
    icon: <MagnifyingGlassIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Контакты",
    path: "/contact",
    icon: <PhoneIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Создать",
    path: "/new-item",
    icon: <PlusIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Управление",
    path: "/dashboard",
    icon: <Cog6ToothIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Авторизация",
    path: "/auth",
    icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
  },
];

/**
 * Component for rendering header and navigation
 * @returns
 */
const Navbar = observer(() => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const tablet = useMediaQuery("(min-width: 768px)"); // media query for conditional rendering of navbar
  const { cart } = useStore();
  const navigate = useNavigate();

  // additional classes for menu & cart wrappers
  const menuClasses: string =
    "w-full h-full fixed z-50 bg-white top-0 left-0 transition-all duration-300 ease-in-out";

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="sticky z-50 top-0 bg-white border-b-2 flex items-center flex-row py-4">
      <nav className="basis-1/12 flex justify-start">
        {isMenuOpen && (
          <div className={menuClasses}>
            <MenuList
              menuItems={menuItems}
              onMenuClose={() => setIsMenuOpen(false)}
            />
            <h1
              className="p-4 font-bold text-red-700 hover:cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </h1>
          </div>
        )}
        {!tablet ? (
          // if screen width smaller than tablets show mobile menu icon
          <div
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-end h-10 w-12 hover:cursor-pointer"
          >
            <Bars3Icon className="w-6 h-6" />
          </div>
        ) : (
          // if screen width bigger than tablets show app name
          <div className="flex items-center justify-end h-10 ml-[1.625rem] whitespace-nowrap">
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
      <div className="basis-1/12 flex justify-end">
        {isCartOpen && (
          <div className={`overflow-auto ${menuClasses}`}>
            <Cart onCartClose={() => setIsCartOpen(false)} />
          </div>
        )}
        <div
          className="flex items-center justify-start hover:cursor-pointer h-10 w-12"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCartIcon className="h-6 w-6" />
          {/* small highlight with counter if cart is not empty */}
          {cart.totalQuantity > 0 && (
            <div className="relative top-[-10px] right-[10px] bg-red-500 rounded-full min-w-[16px] min-h-[16px] px-[3px] outline outline-white outline-2">
              <p className="text-center text-white font-bold align-middle text-xs">
                {cart.totalQuantity}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Navbar;
