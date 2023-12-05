import AmountContolButton from "./UI/AmountContolButton";

/**
 * Component for setting amount of item user whats to buy
 * @param currentValue - current amount of added items
 * @param additonalStyle - optional / for tweaking style of controls wrapper
 * @returns
 */
const AmountControls: React.FC<{
  currentValue: number;
  additonalStyle?: string;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ currentValue, additonalStyle, onDecrement, onIncrement }) => {
  return (
    <div className={`flex ${additonalStyle} items-center h-8`}>
      <AmountContolButton buttonText="-" buttonAction={onDecrement} />
      <span className="px-4">{currentValue}</span>
      <AmountContolButton buttonText="+" buttonAction={onIncrement} />
    </div>
  );
};

export default AmountControls;
