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
      className="bg-background-600 text-text-50 font-medium rounded w-5 vsm:w-6"
      onClick={buttonAction}
    >
      {buttonText}
    </button>
  );
};

export default AmountContolButton;
