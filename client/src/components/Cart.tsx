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
      <div className="flex flex-col min-h-screen">
        <div className="flex fixed top-0 w-full h-[4.5rem] bg-white border-b-2 border-background-200 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] items-center place-content-between py-4">
          <div className="basis-2/12"></div>
          <p className="basis-8/12 text-center text-primary-800 font-medium">
            Корзина:
          </p>
          <div onClick={onCartClose} className="basis-2/12 flex justify-end">
            <div className="flex items-center h-10 w-12 hover:cursor-pointer">
              <XMarkIcon className="w-6 h-6 text-primary-800" />
            </div>
          </div>
        </div>
        <div
          className={`fixed top-[4.5rem] ${
            isContactFormActive ? "bottom-0" : "bottom-[4.5rem]"
          } overflow-y-auto w-full px-4 content-scroll`}
        >
          {isContactFormActive ? (
            <CustomerDataForm onOrderSend={onCartClose} />
          ) : (
            <>
              <div className="my-4 grid h-max gap-2 justify-center">
                <ul className="flex flex-col gap-2 rounded-xl max-w-lg">
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
            </>
          )}
        </div>
        {!isContactFormActive && (
          <div className="fixed bottom-0 w-full bg-background-0 m-auto drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex place-content-around items-center h-[4.5rem] py-3 px-4 gap-2 text-sm vsm:text-base">
            <p className="font-medium text-text-700">
              Cумма заказа: {cart.totalCartPrice}&nbsp;руб.
            </p>
            <DefaultButton
              onClick={() => setIsContactFormActive(true)}
              type="button"
              attr={{
                disabled: cartItems.length === 0,
                style: {
                  opacity: cartItems.length === 0 ? "50%" : "100%",
                },
              }}
            >
              Оформить
            </DefaultButton>
          </div>
        )}
      </div>
    </>
  );
});

export default Cart;
