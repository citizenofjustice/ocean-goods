import { action } from "mobx";
import { Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useLocalStorage } from "usehooks-ts";

import imageNotFound from "@/assets/images/ImageNotFound.svg";
import CartItemModel from "@/classes/CartItemModel";
import { useStore } from "@/store/root-store-context";
import CartAmontControls from "@/components/CartAmontControls";

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
      <li className="flex flex-col gap-1 rounded-xl border bg-background px-4 pb-2 pt-4 text-sm sm:text-base">
        <div className="flex flex-row gap-2">
          <div className="basis-1/4">
            <div className="min-w-[60px] overflow-hidden rounded">
              {cartItem.mainImage ? (
                <img
                  className="rounded"
                  loading="lazy"
                  width={`${cartItem.mainImage.width}px`}
                  height={`${cartItem.mainImage.height}px`}
                  src={`${import.meta.env.VITE_SERVER_URL}${
                    cartItem.mainImage?.path
                  }`}
                  alt="Фото продукта"
                />
              ) : (
                <img
                  className="rounded"
                  width="300px"
                  height="300px"
                  src={imageNotFound}
                />
              )}
            </div>
          </div>
          <div className="flex basis-3/4 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{cartItem.productName}</div>
              <div className="flex items-center">
                <Trash2
                  onClick={handleCartItemRemoval}
                  className="h-5 w-5 hover:cursor-pointer"
                />
              </div>
            </div>
            <div>{`${cartItem.kcal}\u00A0ккал., ${cartItem.weight}\u00A0гр.`}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>Цена: {cartItem.totalProductPrice}&nbsp;руб.</div>
          <div>
            <CartAmontControls
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
