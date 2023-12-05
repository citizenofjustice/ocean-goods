/**
 * Styled amount control button
 * @param buttonText - button content
 * @returns
 */
const AmountContolButton: React.FC<{
  buttonText: string;
  buttonAction: () => void;
}> = ({ buttonText, buttonAction }) => {
  return (
    <button
      type="button"
      className="border-solid border-2 rounded w-6 bg-gray-200"
      onClick={buttonAction}
    >
      {buttonText}
    </button>
  );
};

export default AmountContolButton;
