import { Button } from "@/components/UI/shadcn/button";

/**
 * Styled amount control button
 * @param buttonText - button content
 * @returns
 */
const AmountContolButton: React.FC<{
  children: React.ReactNode;
  buttonAction: () => void;
  ariaLabel: string;
}> = ({ children, buttonAction, ariaLabel }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 rounded-none border-0 bg-primary p-2 text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
      onClick={buttonAction}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};

export default AmountContolButton;
