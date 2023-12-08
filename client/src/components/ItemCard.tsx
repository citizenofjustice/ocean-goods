import { action } from "mobx";
import { observer } from "mobx-react-lite";

import ItemInfoCard from "./UI/ItemInfoCard";
import AmountControls from "./AmontControls";
import { CatalogItem } from "../types/CatalogItem";
import { useStore } from "../store/root-store-context";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItem;
}> = observer(({ catalogItem }) => {
  const { cart } = useStore();

  // check if item is in cart (if there display amount controls)
  const inCartProduct = cart.findCartItem(catalogItem.productId);

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
            <ItemInfoCard>{`${catalogItem.weight} гр.`}</ItemInfoCard>
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
            onClick={action(() => cart.addItem(catalogItem))}
            className="transition ease-in-out transition-all text-white bg-gradient-to-br h-8 px-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm text-center"
          >
            В корзину
          </button>
        )}
        {inCartProduct && (
          <AmountControls
            currentValue={inCartProduct.amount}
            onDecrement={action(() => cart.removeItem(catalogItem.productId))}
            onIncrement={action(() => cart.addItem(catalogItem))}
          />
        )}
      </div>
    </>
  );
});

export default ItemCard;
