const DefaultButton: React.FC<{
  type: "submit" | "reset" | "button" | undefined;
  children: React.ReactNode;
}> = ({ type, children }) => {
  return (
    <>
      <div className="flex justify-center p-4">
        <button
          type={type}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-3 text-center"
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default DefaultButton;
