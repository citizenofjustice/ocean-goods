import { useLocalStorage } from "usehooks-ts";
import CartItemModel from "../classes/CartItemModel";
import { useStore } from "../store/root-store-context";
import DefaultButton from "./UI/DefaultButton";
import AmountControls from "./AmontControls";
import { observer } from "mobx-react-lite";
import CatalogItemModel from "../classes/CatalogItemModel";

const AddToCart: React.FC<{
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
        <DefaultButton type="button" onClick={handleItemCartAddition}>
          {catalogItem.inStock ? "В корзину" : "Нет в наличии"}
        </DefaultButton>
      )}
      {inCartProduct && (
        <AmountControls
          currentValue={inCartProduct.amount}
          onDecrement={() => handleItemDecrement(inCartProduct)}
          onIncrement={handleItemCartAddition}
        />
      )}
    </>
  );
});

export default AddToCart;
