import { observer } from "mobx-react-lite";
import { ScrollArea } from "@/components/UI/shadcn/scroll-area";

import CartElement from "@/components/CartElement";
import { useStore } from "@/store/root-store-context";

/**
 * Component rendering list of cart items
 * @returns
 */
const Cart = observer(() => {
  // getting cart state from store
  const { cart } = useStore();
  const { cartItems } = cart;

  return (
    <>
      <ScrollArea className="h-[75vh] rounded-md border-0 p-4 vsm:border">
        <div className="grid h-max justify-center gap-2 py-2">
          <ul className="flex max-w-lg flex-col gap-2 rounded-xl">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartElement key={item.cartItemId} cartItem={item} />
              ))
            ) : (
              <p className="text-text-700 text-center font-medium">
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
