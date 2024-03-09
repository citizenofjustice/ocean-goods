import { observer } from "mobx-react-lite";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import CartElement from "./CartElement";
import { useStore } from "../store/root-store-context";
import { ScrollArea } from "./UI/scroll-area";

/**
 * Component rendering list of cart items
 * @returns
 */
const Cart = observer(() => {
  // getting cart state from store
  const { cart } = useStore();
  const { cartItems } = cart;

  useLockBodyScroll(); // disabling body scroll

  return (
    <>
      <ScrollArea className="h-[75vh] rounded-md border-0 vsm:border p-4">
        <div className="grid h-max gap-2 justify-center py-2">
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
      </ScrollArea>
    </>
  );
});

export default Cart;
