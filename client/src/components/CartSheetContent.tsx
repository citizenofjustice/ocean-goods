import { X } from "lucide-react";
import { Suspense, lazy } from "react";
import { SheetClose, SheetFooter, SheetHeader } from "./UI/shadcn/sheet";
// import CartCustomerDataForm from "./CartCustomerDataForm";
import Cart from "./Cart";
import { Button } from "./UI/shadcn/button";
import { useStore } from "@/store/root-store-context";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import LoadingSpinner from "./UI/LoadingSpinner";
const CartCustomerDataForm = lazy(() => import("./CartCustomerDataForm"));

const CartSheetContent = observer(() => {
  const { sheet, cart } = useStore();

  return (
    <>
      <SheetHeader>
        <div className="flex justify-between">
          <div className="ml-4 text-lg font-medium">Корзина:</div>
          <SheetClose className="mr-4 rounded-sm ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary vsm:mr-0">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetHeader>
      {sheet.isCartCustomerFormActive ? (
        <Suspense fallback={<LoadingSpinner />}>
          <CartCustomerDataForm
            onPreviousPage={() => sheet.toggleCartCustomerFormActive()}
            onOrderSend={action(() => {
              sheet.toggleCartSheetActive();
              sheet.toggleCartCustomerFormActive();
            })}
          />
        </Suspense>
      ) : (
        <div className="mt-0 vsm:mt-4">
          <Cart />
        </div>
      )}
      <SheetFooter>
        {!sheet.isCartCustomerFormActive && (
          <div className="mt-4 flex w-full items-center justify-between gap-2 gap-2 px-4 py-3 text-sm vsm:text-base">
            <p className="font-medium">
              Cумма заказа: {cart.totalCartPrice}&nbsp;руб.
            </p>
            <Button
              disabled={cart.cartItems.length === 0}
              onClick={() => sheet.toggleCartCustomerFormActive()}
              aria-label="Оформить заказ"
            >
              Оформить
            </Button>
          </div>
        )}
      </SheetFooter>
    </>
  );
});

export default CartSheetContent;
