import { observer } from "mobx-react-lite";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import CartElement from "./CartElement";
import { useStore } from "../store/root-store-context";
import DefaultButton from "./UI/DefaultButton";
import { useState } from "react";
import CustomerDataForm from "./CustomerDataForm";

/**
 * Component rendering list of cart items
 * @returns
 */
const Cart: React.FC<{
  onCartClose: () => void;
}> = observer(({ onCartClose }) => {
  const [isContactFormActive, setIsContactFormActive] = useState(false);
  // getting cart state from store
  const { cart } = useStore();
  const { cartItems } = cart;

  useLockBodyScroll(); // disabling body scroll

  return (
    <>
      <div className="h-screen">
        <div className="flex sticky top-0 h-[4.5rem] bg-white border-b-2 border-background-200 items-center place-content-between py-4">
          <div className="basis-1/12"></div>
          <p className="text-center text-primary-800 font-medium">Корзина:</p>
          <div onClick={onCartClose} className="basis-1/12 flex justify-end">
            <div className="flex items-center h-10 w-12 hover:cursor-pointer">
              <XMarkIcon className="w-6 h-6 text-primary-800" />
            </div>
          </div>
        </div>
        {isContactFormActive ? (
          <CustomerDataForm onOrderSend={onCartClose} />
        ) : (
          <>
            <div className="m-4 grid gap-2 justify-center h-svh">
              <ul className="flex flex-col gap-2 bg-background-50 p-4 rounded-xl max-w-lg">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartElement key={item.cartItemId} cartItem={item} />
                  ))
                ) : (
                  <p className="text-center text-text-700 font-medium">
                    Корзина пуста
                  </p>
                )}
              </ul>
            </div>
            <div className="sticky bottom-0 bg-background-0 m-auto w-full drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex place-content-between items-center py-3 px-8">
              <p className="font-medium text-text-700">
                Общая сумма заказа: {cart.totalCartPrice} руб.
              </p>
              <DefaultButton
                onClick={() => setIsContactFormActive(true)}
                type="button"
              >
                Оформить заказ
              </DefaultButton>
            </div>
          </>
        )}
      </div>
    </>
  );
});

export default Cart;
