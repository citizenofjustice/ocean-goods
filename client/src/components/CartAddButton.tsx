import { observer } from "mobx-react-lite";
import { useLocalStorage } from "usehooks-ts";

import CartItemModel from "@/classes/CartItemModel";
import { useStore } from "@/store/root-store-context";
import { Button } from "@/components/UI/shadcn/button";
import CatalogItemModel from "@/classes/CatalogItemModel";
import CartAmontControls from "@/components/CartAmontControls";

const CartAddButton: React.FC<{
  productId: number;
  catalogItem: CatalogItemModel;
}> = observer(({ productId, catalogItem }) => {
  const { cart } = useStore();
  const { cartItems } = cart;
  const [, setCartContent] = useLocalStorage("cart", cartItems);

  // check if item is in cart (if there display amount controls)
  const inCartProduct = cart.findCartItem(productId);

  const handleItemCartAddition = () => {
    cart.addItem(catalogItem);
    setCartContent(cartItems);
  };

  const handleItemDecrement = (inCartProduct: CartItemModel) => {
    try {
      // Decrease amound and filter item if this product amount 0
      const filteredItems: CartItemModel[] | undefined =
        cart.amountDecrease(inCartProduct);
      if (!filteredItems) throw new Error("Item amount decrease gone wrong");
      setCartContent(filteredItems);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!inCartProduct && (
        <Button
          className="h-8 px-2 sm:h-10 sm:px-4"
          disabled={!catalogItem.inStock}
          onClick={handleItemCartAddition}
          aria-label={catalogItem.inStock ? "В корзинну" : "Нет в наличии"}
        >
          {catalogItem.inStock ? "В корзину" : "Нет в наличии"}
        </Button>
      )}
      {inCartProduct && (
        <CartAmontControls
          currentValue={inCartProduct.amount}
          onDecrement={() => handleItemDecrement(inCartProduct)}
          onIncrement={handleItemCartAddition}
        />
      )}
    </>
  );
});

export default CartAddButton;
