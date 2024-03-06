import { Minus, Plus } from "lucide-react";
import AmountContolButton from "./ui/AmountContolButton";

/**
 * Component for setting amount of item user whats to buy
 * @param currentValue - current amount of added items
 * @returns
 */
const AmountControls: React.FC<{
  currentValue: number;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ currentValue, onDecrement, onIncrement }) => {
  return (
    <div className="flex h-8 sm:h-10 px-1 border rounded-md rounded items-center text-sm sm:text-base">
      <AmountContolButton buttonAction={onDecrement}>
        <Minus className="w-3 h-3" />
      </AmountContolButton>
      <span className="rounded bg-background-0 font-medium w-8 sm:w-10 text-center mx-0 px-2">
        {currentValue}
      </span>
      <AmountContolButton buttonAction={onIncrement}>
        <Plus className="w-3 h-3" />
      </AmountContolButton>
    </div>
  );
};

export default AmountControls;
