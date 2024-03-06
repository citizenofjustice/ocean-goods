import { Button } from "./button";

/**
 * Styled amount control button
 * @param buttonText - button content
 * @returns
 */
const AmountContolButton: React.FC<{
  children: React.ReactNode;
  buttonAction: () => void;
}> = ({ children, buttonAction }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-5 sm:h-8 p-1 sm:p-2 bg-secondary"
      onClick={buttonAction}
    >
      {children}
    </Button>
  );
};

export default AmountContolButton;
