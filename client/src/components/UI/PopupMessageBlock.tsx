import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { PopupMessage } from "../../types/Popup";

const PopupMessageBlock: React.FC<{
  popup: PopupMessage;
  onClose: () => void;
}> = ({ popup, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShow(false);
        onClose();
      },
      popup.type === "success" ? 2000 : 5000
    );

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popup.type]);

  const handleMessageClose = () => {
    setShow(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className={`${popup.type} rounded w-fit max-w-[80vw] m-auto flex items-center gap-2 py-2 text-sm vsm:text-base text-white font-medium`}
    >
      <div className="px-4 text-center">{popup.message}</div>
      <div className="px-1">
        <XMarkIcon
          onClick={handleMessageClose}
          className="w-6 h-6 hover:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PopupMessageBlock;
