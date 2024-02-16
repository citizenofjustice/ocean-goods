import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const ErrorPage: React.FC<{
  error: Error;
  customMessage?: string;
}> = observer(({ error, customMessage }) => {
  const [isErrorDetailsShown, setIsErrorDetailsShown] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[80vh]">
        <div className="p-4 bg-background-200 rounded-md">
          <p className="p-2">{customMessage}</p>
          <div
            onClick={() => setIsErrorDetailsShown((prevValue) => !prevValue)}
            className="flex justify-end gap-1 items-center select-none hover:cursor-pointer"
          >
            {isErrorDetailsShown ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
            детали...
          </div>
          {isErrorDetailsShown && (
            <p className="mt-4 border-2 border-red-400 bg-background-50 rounded-md p-2">
              {error instanceof AxiosError
                ? error.response?.data.error.message
                : error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ErrorPage;
