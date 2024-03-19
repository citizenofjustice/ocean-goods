import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/shadcn/alert-dialog";
import { useOnClickOutside } from "usehooks-ts";

const ConfirmActionAlert: React.FC<{
  children: React.ReactNode;
  question: string;
  message?: string;
  onConfirm: () => void;
}> = ({ children, question, message, onConfirm }) => {
  const [open, setOpen] = useState(false);
  const alertRef = useRef(null);
  useOnClickOutside(alertRef, () => setOpen(false));

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent ref={alertRef} className="rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{question}</AlertDialogTitle>
          {message && (
            <AlertDialogDescription>{message}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Подтвердить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmActionAlert;
