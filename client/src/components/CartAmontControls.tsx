import { Minus, Plus } from "lucide-react";

import AmountContolButton from "@/components/UI/AmountContolButton";

/**
 * Component for setting amount of item user whats to buy
 * @param currentValue - current amount of added items
 * @returns
 */
const CartAmontControls: React.FC<{
  currentValue: number;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ currentValue, onDecrement, onIncrement }) => {
  return (
    <div className="flex h-8 items-center rounded rounded-md border px-1 text-sm sm:h-10 sm:text-base">
      <AmountContolButton buttonAction={onDecrement} ariaLabel="Убавить">
        <Minus className="h-3 w-3" />
      </AmountContolButton>
      <span className="bg-background-0 mx-0 w-8 rounded px-2 text-center font-medium sm:w-10">
        {currentValue}
      </span>
      <AmountContolButton buttonAction={onIncrement} ariaLabel="Добавить">
        <Plus className="h-3 w-3" />
      </AmountContolButton>
    </div>
  );
};

export default CartAmontControls;
