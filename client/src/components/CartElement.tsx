import { action } from "mobx";
import { observer } from "mobx-react-lite";

import AmountControls from "./AmontControls";
import CartItemModel from "../classes/CartItemModel";
import { useStore } from "../store/root-store-context";
import { useLocalStorage } from "@uidotdev/usehooks";
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * Component for rendering each cart element
 * @param item - cart item
 * @returns
 */
const CartElement: React.FC<{
  cartItem: CartItemModel;
}> = observer(({ cartItem }) => {
  const { cart } = useStore();
  const { cartItems } = cart;
  const [, setCartContent] = useLocalStorage("cart", cartItems);

  const handleCartItemRemoval = () => {
    try {
      // Decrease amound and filter item if this product amount 0
      const cartItemsKept = cart.removeItem(cartItem.cartItemId);
      if (!cartItemsKept) throw new Error("Cart item removal gone wrong");
      setCartContent(cartItemsKept);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <li className="flex flex-col gap-1 bg-background-200 rounded-xl px-4 pt-4 pb-2 text-sm vsm:text-base">
        <div className="flex flex-row gap-2">
          <div className="basis-1/4">
            <div className="rounded overflow-hidden min-w-[60px]">
              {cartItem.mainImage && (
                <img className="rounded" src={cartItem.mainImage} />
              )}
            </div>
          </div>
          <div className="basis-3/4 flex flex-col gap-1">
            <div className="flex gap-2 justify-between items-center">
              <div className="font-medium">{cartItem.productName}</div>
              <div className="flex items-center">
                <TrashIcon
                  onClick={handleCartItemRemoval}
                  className="w-6 h-6 text-primary-800 hover:cursor-pointer"
                />
              </div>
            </div>
            <div>{`${cartItem.kcal}\u00A0ккал., ${cartItem.weight}\u00A0гр.`}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Цена: {cartItem.totalProductPrice}&nbsp;руб.</div>
          <div>
            <AmountControls
              currentValue={cartItem.amount}
              onDecrement={action(() => {
                const filteredItems: CartItemModel[] | undefined =
                  cart.amountDecrease(cartItem);
                filteredItems && setCartContent(filteredItems);
              })}
              onIncrement={action(() => {
                cartItem.amount++;
                setCartContent(cartItems);
              })}
            />
          </div>
        </div>
      </li>
    </>
  );
});

export default CartElement;
