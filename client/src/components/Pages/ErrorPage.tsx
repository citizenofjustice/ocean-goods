import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const ErrorPage: React.FC<{
  error: Error;
  customMessage: string;
}> = observer(({ error, customMessage }) => {
  const [isErrorDetailsShown, setIsErrorDetailsShown] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-[90vw] max-w-lg w-fit p-4 bg-background-200 rounded-md">
        <p className="w-full p-2">{customMessage}</p>
        <div
          onClick={() => setIsErrorDetailsShown((prevValue) => !prevValue)}
          className="w-full flex justify-end select-none hover:cursor-pointer"
        >
          <div className="flex items-center gap-1 rounded-full px-2 border-2 border-accent-700 bg-primary-100">
            {isErrorDetailsShown ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
            детали...
          </div>
        </div>
        {isErrorDetailsShown && (
          <div className="w-full">
            <p className="mt-4 border-2 border-red-400 bg-background-50 rounded-md p-2">
              {error instanceof AxiosError
                ? error.response?.data.error.message
                : error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ErrorPage;
