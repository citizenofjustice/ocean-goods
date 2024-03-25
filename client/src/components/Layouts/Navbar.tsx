import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/UI/shadcn/sheet";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useMediaQuery } from "usehooks-ts";
import { LogIn, Menu, X, ShoppingCart } from "lucide-react";

import PersistAuth from "@/components/PersistAuth";
import WebAppLogo from "@/components/UI/WebAppLogo";
import MenuList from "@/components/Layouts/MenuList";
import { useStore } from "@/store/root-store-context";
import { menuItems } from "@/components/Layouts/menuItems";
import CartSheetContent from "@/components/CartSheetContent";
import UserDropdownMenu from "@/components/UI/UserDropdownMenu";

/**
 * Component for rendering header and navigation
 * @returns
 */
const Navbar = observer(() => {
  const tablet = useMediaQuery("(min-width: 768px)"); // media query for conditional rendering of navbar
  const { cart, auth, sheet } = useStore();

  return (
    <>
      <header className="hearer-sticky border-background-200 z-50 flex h-[4.5rem] flex-row items-center justify-between border-b-2 bg-background px-4 py-4 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)]">
        <div className="flex basis-2/12 justify-start">
          {!tablet ? (
            <Sheet
              open={sheet.isMenuSheetActive}
              onOpenChange={() => sheet.toggleMenuSheetActive()}
            >
              <SheetTrigger aria-label="Открыть меню">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] px-4 sm:w-[540px]">
                <SheetClose className="rounded-sm ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </SheetClose>
                <MenuList
                  menuItems={menuItems}
                  onMenuClose={() => sheet.toggleMenuSheetActive()}
                />
              </SheetContent>
            </Sheet>
          ) : (
            // if screen width bigger than tablets show app name
            <div className="flex h-10 items-center justify-end whitespace-nowrap">
              <WebAppLogo />
            </div>
          )}
        </div>
        <div className="flex basis-8/12 justify-center">
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
        <div className="flex basis-2/12 items-center justify-end">
          <PersistAuth>
            {auth.isAuth ? (
              <div className="relative mr-4">
                <UserDropdownMenu />
              </div>
            ) : (
              <Link
                to="/auth"
                className="mx-4 flex flex-row items-center"
                aria-label="Войти в учетную запись"
              >
                <LogIn className="h-6 w-6" />
              </Link>
            )}
          </PersistAuth>
          <Sheet
            open={sheet.isCartSheetActive}
            onOpenChange={() => sheet.toggleCartSheetActive()}
          >
            <SheetTrigger className="relative">
              <ShoppingCart className="h-6 w-6" />
              {/* small highlight with counter if cart is not empty */}
              {cart.totalQuantity > 0 && (
                <div className="absolute right-[-4px] top-[-6px] min-h-[16px] min-w-[16px] rounded-full bg-red-500 px-[3px] outline outline-2 outline-white">
                  <p className="text-center align-middle text-xs font-medium text-white">
                    {cart.totalQuantity}
                  </p>
                </div>
              )}
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full px-0 vsm:px-4 sm:min-w-[600px]"
            >
              <CartSheetContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
});

export default Navbar;
