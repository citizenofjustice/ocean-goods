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
        <div className="flex sticky top-0 bg-white border-b-2 items-center place-content-between">
          <div className="basis-1/12"></div>
          <p className="text-center">Корзина:</p>
          <div
            onClick={onCartClose}
            className="basis-1/12 flex justify-end mr-6 mt-4 mb-4 hover:cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
        <ul className="divide-y">
          {cartItems &&
            cartItems.map((item) => (
              <CartElement key={item.cartItemId} cartItem={item} />
            ))}
        </ul>
      </div>
    </>
  );
});

export default Cart;
