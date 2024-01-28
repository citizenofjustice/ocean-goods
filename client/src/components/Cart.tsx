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
      <div>
        <div className="flex sticky top-0 bg-white border-b-2 items-center place-content-between py-4">
          <div className="basis-1/12"></div>
          <p className="text-center">Корзина:</p>
          <div onClick={onCartClose} className="basis-1/12 flex justify-end">
            <div className="flex items-center h-10 w-12 hover:cursor-pointer">
              <XMarkIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        {isContactFormActive ? (
          <CustomerDataForm onOrderSend={onCartClose} />
        ) : (
          <>
            <ul className="divide-y">
              {cartItems &&
                cartItems.map((item) => (
                  <CartElement key={item.cartItemId} cartItem={item} />
                ))}
            </ul>
            <div className="flex place-content-between items-center py-4 px-8">
              <p>Общая сумма заказа:</p>
              <p>{`${cart.totalCartPrice} руб.`}</p>
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
