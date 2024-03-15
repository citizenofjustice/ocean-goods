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
