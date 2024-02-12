import { nanoid } from "nanoid";
import { useState } from "react";
import {
  Bars3Icon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Cart from "../Cart";
import MenuList from "../MenuList";
import { MenuItem } from "../../types/MenuItem";
import { useStore } from "../../store/root-store-context";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import UserDropdownMenu from "../UI/UserDropdownMenu";
import SignInSVG from "../UI/SignInSVG";
import Logo from "../../assets/images/Logo.svg";

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
];

/**
 * Component for rendering header and navigation
 * @returns
 */
const Navbar = observer(() => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const tablet = useMediaQuery("(min-width: 768px)"); // media query for conditional rendering of navbar
  const { cart, auth } = useStore();

  // additional classes for menu & cart wrappers
  const menuClasses: string =
    "w-full h-full fixed z-50 bg-background-0 top-0 left-0 transition-all duration-300 ease-in-out"; //

  return (
    <>
      {isMenuOpen && (
        <div className={`relative z-50 ${menuClasses}`}>
          <MenuList
            menuItems={menuItems}
            onMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
      )}
      {isCartOpen && (
        <div className={`relative z-50 ${menuClasses}`}>
          <Cart onCartClose={() => setIsCartOpen(false)} />
        </div>
      )}
      <header className="hearer-sticky h-[4.5rem] z-50 bg-background-0 border-b-2 border-background-200 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex items-center flex-row py-4">
        <nav className="basis-2/12 flex justify-start">
          {!tablet ? (
            // if screen width smaller than tablets show mobile menu icon
            <div
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-end h-10 w-12 hover:cursor-pointer"
            >
              <Bars3Icon className="w-6 h-6 text-primary-800" />
            </div>
          ) : (
            // if screen width bigger than tablets show app name
            <div className="flex items-center justify-end h-10 ml-[1.625rem] whitespace-nowrap">
              <WebAppLogo />
            </div>
          )}
        </nav>
        <div className="basis-8/12 flex justify-center">
          {!tablet ? (
            // if screen width smaller than tablets show app name
            <WebAppLogo />
          ) : (
            // if screen width smaller than tablets show desktop menu
            <>
              <MenuList menuItems={menuItems} isDesktop />
            </>
          )}
        </div>
        <div className="basis-2/12 flex items-center justify-end">
          {auth.isAuth ? (
            <div className="relative mr-3">
              <UserDropdownMenu />
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="mx-4 flex flex-row items-center text-primary-800"
            >
              <SignInSVG className="w-6 h-6" />
            </NavLink>
          )}
          <div
            className="flex items-center justify-start hover:cursor-pointer h-10 w-12"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCartIcon className="h-6 w-6 text-primary-800" />
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
    </>
  );
});

const WebAppLogo = () => {
  return (
    <Link to="/">
      <div className="logo-filter w-20 h-16">
        <img
          src={Logo}
          className="w-fit h-fit"
          alt="website logo Ocean Goods"
        />
      </div>
    </Link>
  );
};

export default Navbar;
