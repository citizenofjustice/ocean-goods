import ItemInfoCard from "./UI/ItemInfoCard";
import AmountControls from "./AmontControls";
import { CatalogItem } from "../types/CatalogItem";
import { action } from "mobx";
import { useStore } from "../store/root-store-context";
import CartItemModel from "../classes/CartItemModel";
import { observer } from "mobx-react-lite";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItem;
}> = observer(({ catalogItem }) => {
  const { cart } = useStore();
  const { cartItems } = cart;
  const inCartProduct: CartItemModel | undefined = cartItems.find(
    (item) => item.productId === catalogItem.productId
  );

  return (
    <>
      <div className="my-2">{catalogItem.name}</div>
      <div className="flex justify-center mb">
        <div className="basis-1/12" />
        <div className="grow rounded overflow-hidden flex items-center">
          {catalogItem.image}
        </div>
        <div className="basis-1/12" />
        <div className="basis-2/12 flex items-center">
          <div className="flex flex-col justify-end">
            <ItemInfoCard>{`${catalogItem.weigth} гр.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.kcal} ккал.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.price} руб.`}</ItemInfoCard>
          </div>
        </div>
        <div className="basis-1/12" />
      </div>
      <div className="py-2">
        {!inCartProduct && (
          <button
            type="button"
            onClick={action(() => cart.addItem(catalogItem))} //() => setItemAmount((prev) => prev + 1)
            className="transition ease-in-out transition-all text-white bg-gradient-to-br h-8 px-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm text-center"
          >
            В корзину
          </button>
        )}
        {inCartProduct && (
          <AmountControls
            currentValue={inCartProduct.amount}
            onDecrement={action(() => inCartProduct.decrementAmount())}
            onIncrement={action(() => inCartProduct.incrementAmount())}
          />
        )}
      </div>
    </>
  );
});

export default ItemCard;
