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
    const cartItemsKept = cart.removeItem(cartItem.cartItemId);
    setCartContent(cartItemsKept);
  };

  return (
    <>
      <li className="flex flex-row gap-2">
        <div className="flex flex-row place-content-between bg-background-200 h-fit rounded-xl p-4">
          <div className="basis-3/12 rounded overflow-hidden mr-2 min-w-[50px]">
            {cartItem.mainImage && (
              <img className="rounded" src={cartItem.mainImage} />
            )}
          </div>
          <div className="grow flex flex-col justify-start items-start mr-2">
            <div className="font-medium">{cartItem.productName}</div>
            <div>{`${cartItem.kcal}\u00A0ккал., ${cartItem.weight}\u00A0гр.`}</div>
          </div>
          <div className="basis-1/12 text-right mr-2">
            {cartItem.totalProductPrice}&nbsp;руб.
          </div>
          <div className="basis-1/12 flex items-center">
            <AmountControls
              currentValue={cartItem.amount}
              isVertical={true}
              onDecrement={action(() => {
                const filteredItems: CartItemModel[] =
                  cart.amountDecrease(cartItem);
                setCartContent(filteredItems);
              })}
              onIncrement={action(() => {
                cartItem.amount++;
                setCartContent(cartItems);
              })}
            />
          </div>
        </div>
        {/* <div className="flex items-center">
          <TrashIcon
            onClick={handleCartItemRemoval}
            className="w-6 h-6 text-primary-800 hover:cursor-pointer"
          />
        </div> */}
      </li>
    </>
  );
});

export default CartElement;
