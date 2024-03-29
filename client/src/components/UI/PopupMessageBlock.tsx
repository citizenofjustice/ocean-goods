import { X } from "lucide-react";
import React, { useState, useEffect } from "react";

import { PopupMessage } from "@/types/Popup";

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
      popup.type === "success" ? 2000 : 5000,
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
      className={`${popup.type} m-auto flex w-fit max-w-[80vw] items-center gap-2 rounded py-2 text-sm font-medium text-white vsm:text-base`}
    >
      <div className="px-4 text-center">{popup.message}</div>
      <div className="px-1">
        <X
          onClick={handleMessageClose}
          className="h-6 w-6 hover:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PopupMessageBlock;
