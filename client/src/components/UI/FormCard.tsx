const FormCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="text-center vvsm:w-4/5 min-w-56 max-w-md bg-gray-200 rounded-lg p-4">
        {children}
      </div>
    </>
  );
};

export default FormCard;
