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
          ? "flex-col-reverse justify-end w-4 vsm:w-6 "
          : "flex-row justify-between h-4 vsm:h-6"
      } rounded items-center text-sm vsm:text-base`}
    >
      <AmountContolButton buttonText="-" buttonAction={onDecrement} />
      <span
        className={`rounded bg-background-0 font-medium ${
          isVertical
            ? "h-8 vsm:h-10 flex items-center justify-center my-1 w-full"
            : "w-8 vsm:w-10 text-center mx-1 px-2"
        }`}
      >
        {currentValue}
      </span>
      <AmountContolButton buttonText="+" buttonAction={onIncrement} />
    </div>
  );
};

export default AmountControls;
