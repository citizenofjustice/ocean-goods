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
    <div className="flex h-8 w-[5.5rem] items-center justify-between overflow-hidden rounded rounded-md text-sm sm:text-base">
      <AmountContolButton buttonAction={onDecrement} ariaLabel="Убавить">
        <Minus className="h-3 w-3" />
      </AmountContolButton>
      <span className="flex h-full w-full items-center justify-center bg-primary/10 text-center font-medium">
        {currentValue}
      </span>
      <AmountContolButton buttonAction={onIncrement} ariaLabel="Добавить">
        <Plus className="h-3 w-3" />
      </AmountContolButton>
    </div>
  );
};

export default CartAmontControls;
