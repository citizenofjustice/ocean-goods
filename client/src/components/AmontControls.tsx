import AmountContolButton from "./UI/AmountContolButton";

/**
 * Component for setting amount of item user whats to buy
 * @param currentValue - current amount of added items
 * @param isVertical - optional / for tweaking style of controls wrapper
 * @returns
 */
const AmountControls: React.FC<{
  currentValue: number;
  isVertical?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ currentValue, isVertical = false, onDecrement, onIncrement }) => {
  return (
    <div
      className={`flex ${
        isVertical
          ? "flex-col-reverse justify-end w-8"
          : "flex-row justify-between h-8"
      } rounded items-center`}
    >
      <AmountContolButton buttonText="-" buttonAction={onDecrement} />
      <span
        className={`rounded bg-background-0 mx-1 px-2 font-medium ${
          isVertical ? "h-10 flex items-center" : "w-10 text-center"
        }`}
      >
        {currentValue}
      </span>
      <AmountContolButton buttonText="+" buttonAction={onIncrement} />
    </div>
  );
};

export default AmountControls;
