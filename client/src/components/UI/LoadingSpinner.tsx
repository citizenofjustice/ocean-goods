import { Loader2 } from "lucide-react";

const LoadingSpinner: React.FC<{
  size?: "small" | "normal" | "large";
  wrapperSize?: string;
  color?: string;
}> = ({
  size = "normal",
  wrapperSize = "h-40",
  color = "text-primary-600",
}) => {
  let spinnerSize: string;
  switch (size) {
    case "small":
      spinnerSize = "5";
      break;
    case "normal":
      spinnerSize = "10";
      break;
    case "large":
      spinnerSize = "14";
      break;

    default:
      spinnerSize = "10";
      break;
  }

  return (
    <>
      <div className={`flex items-center justify-center ${wrapperSize}`}>
        <div
          className={`animate-spin w-${spinnerSize} h-${spinnerSize} ${color}`}
        >
          <Loader2 className={`w-${spinnerSize} h-${spinnerSize}`} />
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
