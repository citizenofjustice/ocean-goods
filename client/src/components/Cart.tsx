import { observer } from "mobx-react-lite";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import CartElement from "./CartElement";
import { useStore } from "../store/root-store-context";

/**
 * Component rendering list of cart items
 * @returns
 */
const Cart: React.FC<{
  onCartClose: () => void;
}> = observer(({ onCartClose }) => {
  // getting cart state from store
  const { cart } = useStore();
  const { cartItems } = cart;

  useLockBodyScroll(); // disabling body scroll

  return (
    <>
      <div>
        <div className="flex sticky top-0 bg-white border-b-2 items-center place-content-between p-4">
          <div className="basis-1/12"></div>
          <p className="text-center">Корзина:</p>
          <div
            onClick={onCartClose}
            className="basis-1/12 flex justify-end hover:cursor-pointer"
          >
            <div className="flex items-center h-10 w-12 ">
              <XMarkIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <ul className="divide-y">
          {cartItems &&
            cartItems.map((item) => (
              <CartElement key={item.cartItemId} cartItem={item} />
            ))}
        </ul>
        <div className="flex place-content-between items-center py-4 px-8">
          <p>Общая сумма заказа:</p>
          <p>{`${cart.totalCartPrice} руб.`}</p>
        </div>
      </div>
    </>
  );
});

export default Cart;
