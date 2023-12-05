import { useState } from "react";

import { cartItem } from "./Cart";
import AmountControls from "./AmontControls";

/**
 * Component for rendering each cart element
 * @param item - cart item
 * @returns
 */
const CartElement: React.FC<{
  cartItem: cartItem;
}> = ({ cartItem }) => {
  const [currentValue, setCurrentValue] = useState<number>(cartItem.amount);

  return (
    <>
      <li className="flex flex-row place-content-between items-align h-fit mx-4 py-4">
        <div className="basis-2/6 rounded overflow-hidden mr-4 min-w-[80px]">
          {cartItem.image}
        </div>
        <div className="grow flex flex-col justify-start items-start mr-4">
          <div>{cartItem.name}</div>
          <div>{`${cartItem.kcal} ккал., ${cartItem.weigth} гр.`}</div>
        </div>
        <div className="basis-1/8 text-right mr-4">{`${
          cartItem.price * cartItem.amount
        } руб.`}</div>
        <div className="basis-1/8">
          <AmountControls
            currentValue={currentValue}
            additonalStyle="flex-col-reverse justify-end"
            onDecrement={() => setCurrentValue((prev) => prev - 1)}
            onIncrement={() => setCurrentValue((prev) => prev + 1)}
          />
        </div>
      </li>
    </>
  );
};

export default CartElement;
