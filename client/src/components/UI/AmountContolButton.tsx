import { Button } from "@/components/UI/shadcn/button";

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
      className="h-5 bg-secondary p-1 sm:h-8 sm:p-2"
      onClick={buttonAction}
    >
      {children}
    </Button>
  );
};

export default AmountContolButton;
