const CustomAlertMessage: React.FC<{
  message: string;
}> = ({ message }) => {
  return (
    <>
      <p className="text-center text-red-500 font-bold p-4">{message}</p>
    </>
  );
};

export default CustomAlertMessage;
