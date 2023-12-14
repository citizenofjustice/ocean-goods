import { action } from "mobx";
import { observer } from "mobx-react-lite";

import AmountControls from "./AmontControls";
import CartItemModel from "../classes/CartItemModel";
import { useStore } from "../store/root-store-context";
import { useLocalStorage } from "@uidotdev/usehooks";

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

  return (
    <>
      <li className="flex flex-row place-content-between items-align h-fit mx-4 py-4">
        <div className="basis-2/6 rounded overflow-hidden mr-4 min-w-[80px]">
          {cartItem.mainImage && <img src={cartItem.mainImage} />}
        </div>
        <div className="grow flex flex-col justify-start items-start mr-4">
          <div>{cartItem.productName}</div>
          <div>{`${cartItem.kcal} ккал., ${cartItem.weight} гр.`}</div>
        </div>
        <div className="basis-1/8 text-right mr-4">
          {cartItem.totalProductPrice}
        </div>
        <div className="basis-1/8">
          <AmountControls
            currentValue={cartItem.amount}
            additonalStyle="flex-col-reverse justify-end"
            onDecrement={action(() => {
              const filteredItems: CartItemModel[] = cart.removeItem(cartItem);
              setCartContent(filteredItems);
            })}
            onIncrement={action(() => {
              cartItem.amount--;
              setCartContent(cartItems);
            })}
          />
        </div>
      </li>
    </>
  );
});

export default CartElement;
