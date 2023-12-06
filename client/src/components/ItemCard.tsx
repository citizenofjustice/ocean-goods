import { useState } from "react";

import ItemInfoCard from "./UI/ItemInfoCard";
import AmountControls from "./AmontControls";
import { CatalogItem } from "../types/CatalogItem";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItem;
}> = ({ catalogItem }) => {
  // state for setting each item amount to buy
  const [itemAmount, setItemAmount] = useState<number>(0);
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
        {itemAmount === 0 && (
          <button
            type="button"
            onClick={() => setItemAmount((prev) => prev + 1)}
            className="transition ease-in-out transition-all text-white bg-gradient-to-br h-8 px-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm text-center"
          >
            В корзину
          </button>
        )}
        {itemAmount > 0 && (
          <AmountControls
            currentValue={itemAmount}
            onDecrement={() => setItemAmount((prev) => prev - 1)}
            onIncrement={() => setItemAmount((prev) => prev + 1)}
          />
        )}
      </div>
    </>
  );
};

export default ItemCard;
