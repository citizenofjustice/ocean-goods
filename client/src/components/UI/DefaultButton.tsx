import LoadingSpinner from "./LoadingSpinner";

const DefaultButton: React.FC<{
  type: "submit" | "reset" | "button" | undefined;
  children: React.ReactNode;
  onClick?: () => void;
  attr?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  isPending?: boolean;
}> = ({ type, children, onClick, attr, isPending }) => {
  return (
    <>
      <div className="flex justify-center">
        <button
          type={type}
          onClick={onClick}
          className={`text-white bg-background-600 hover:bg-primary-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500 font-medium text-sm vsm:text-base rounded-lg sm:w-auto px-3 py-1 text-center`}
          {...attr}
          disabled={isPending} // Disable the button when isPending is true
        >
          {isPending ? (
            <LoadingSpinner
              size="small"
              wrapperSize="w-20 h-6"
              color="text-text-50"
            />
          ) : (
            children
          )}
        </button>
      </div>
    </>
  );
};

export default DefaultButton;
