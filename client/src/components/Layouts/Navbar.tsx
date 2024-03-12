import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import {
  Bars3Icon,
  Squares2X2Icon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Cart from "../Cart";
import MenuList from "../MenuList";
import { MenuItem } from "../../types/MenuItem";
import { useStore } from "../../store/root-store-context";
import UserDropdownMenu from "../UI/UserDropdownMenu";
import SignInSVG from "../UI/SignInSVG";
import Logo from "../../assets/images/Logo.svg";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetFooter,
  SheetHeader,
} from "../UI/sheet";
import { X } from "lucide-react";
import CustomerDataForm from "../CustomerDataForm";
import { Button } from "../UI/button";

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
  const [isContactFormActive, setIsContactFormActive] = useState(false);
  const tablet = useMediaQuery("(min-width: 768px)"); // media query for conditional rendering of navbar
  const { cart, auth } = useStore();

  const menuSheetRef = useRef(null);
  const cartSheetRef = useRef(null);
  useOnClickOutside(menuSheetRef, () => setIsMenuOpen(false));
  useOnClickOutside(cartSheetRef, () => setIsCartOpen(false));

  return (
    <>
      <header className="hearer-sticky h-[4.5rem] z-50 bg-background-0 border-b-2 border-background-200 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex items-center flex-row py-4">
        <nav className="basis-2/12 flex justify-start">
          {!tablet ? (
            <Sheet open={isMenuOpen}>
              <SheetTrigger>
                <div
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center justify-end h-10 w-12 hover:cursor-pointer"
                >
                  <Bars3Icon className="w-6 h-6 text-primary-800" />
                </div>
              </SheetTrigger>
              <SheetContent
                ref={menuSheetRef}
                side="left"
                className="w-[240px] sm:w-[540px]"
              >
                <SheetClose
                  onClick={() => setIsMenuOpen(false)}
                  className="left-6 top-6 rounded-sm ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary"
                >
                  <X className="w-6 h-6" />
                  <span className="sr-only">Close</span>
                </SheetClose>
                <MenuList
                  menuItems={menuItems}
                  onMenuClose={() => setIsMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
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
          <Sheet open={isCartOpen}>
            <SheetTrigger>
              <div
                onClick={() => setIsCartOpen(true)}
                className="flex items-center justify-start h-10 w-12 hover:cursor-pointer"
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
            </SheetTrigger>
            <SheetContent
              ref={cartSheetRef}
              side="right"
              className="w-full sm:min-w-[600px] px-0 vsm:px-4"
            >
              <SheetHeader>
                <div className="flex justify-between">
                  <div className="ml-4 text-lg font-semibold">Корзина:</div>
                  <SheetClose
                    onClick={() => setIsCartOpen(false)}
                    className="mr-4 vsm:mr-0 rounded-sm ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary"
                  >
                    <X className="w-6 h-6" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
              </SheetHeader>
              {isContactFormActive ? (
                <CustomerDataForm
                  onPreviousPage={() => setIsContactFormActive(false)}
                  onOrderSend={() => setIsCartOpen(false)}
                />
              ) : (
                <div className="mt-0 vsm:mt-4">
                  <Cart />
                </div>
              )}
              <SheetFooter>
                {!isContactFormActive && (
                  <div className="mt-4 flex w-full items-center justify-between gap-2 py-3 px-4 gap-2 text-sm vsm:text-base">
                    <p className="font-medium text-text-700">
                      Cумма заказа: {cart.totalCartPrice}&nbsp;руб.
                    </p>
                    <Button
                      disabled={cart.cartItems.length === 0}
                      onClick={() => setIsContactFormActive(true)}
                    >
                      Оформить
                    </Button>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
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
