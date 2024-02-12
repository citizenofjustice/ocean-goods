const DefaultButton: React.FC<{
  type: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ type, children, onClick }) => {
  return (
    <>
      <div className="flex justify-center">
        <button
          type={type}
          onClick={onClick}
          className="text-white bg-background-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500 font-medium rounded-lg sm:w-auto px-5 py-2 text-center"
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default DefaultButton;
