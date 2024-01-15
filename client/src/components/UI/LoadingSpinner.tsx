import LoadingSVG from "./LoadingSVG";

const LoadingSpinner = () => {
  return (
    <>
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin w-10 h-10">
          <LoadingSVG className="w-10 h-10" />
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
