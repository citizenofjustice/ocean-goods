import { z } from "zod";
import { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/shadcn/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/UI/shadcn/drawer";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/UI/shadcn/button";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

import { Privelege } from "@/types/Privelege";
import RolesForm from "@/components/RolesForm";
import { zodRolesForm } from "@/lib/zodRolesForm";

interface RolesDialogProps {
  form: UseFormReturn<z.infer<typeof zodRolesForm>>;
  children: React.ReactNode;
  onSubmit: (values: z.infer<typeof zodRolesForm>) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  priveleges: Privelege[];
}

const RolesDialog: React.FC<RolesDialogProps> = ({
  form,
  children,
  onSubmit,
  isOpen,
  onClose,
  onOpen,
  priveleges,
}) => {
  const dialogRef = useRef(null);
  useOnClickOutside(dialogRef, onClose);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button className="p-0" variant="link" onClick={onOpen}>
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent ref={dialogRef} className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Введите данные роли пользователя</DialogTitle>
          </DialogHeader>
          <RolesForm form={form} onSubmit={onSubmit} priveleges={priveleges} />
          <DialogFooter>
            <Button form="role-form" type="submit" aria-label="Сохранить роль">
              Сохранить
            </Button>
            <DialogClose asChild>
              <Button
                onClick={onClose}
                type="button"
                variant="outline"
                aria-label="Отмена"
              >
                Отмена
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerTrigger asChild>
        <Button className="p-0" variant="link" onClick={onOpen}>
          {children}
        </Button>
      </DrawerTrigger>
      <DrawerContent ref={dialogRef}>
        <DrawerHeader className="text-left">
          <DrawerTitle>Введите данные роли пользователя</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <RolesForm form={form} onSubmit={onSubmit} priveleges={priveleges} />
        </div>
        <DrawerFooter className="pt-4">
          <Button form="role-form" type="submit" aria-label="Сохранить роль">
            Сохранить
          </Button>
          <DrawerClose asChild>
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              aria-label="Отмена"
            >
              Отмена
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RolesDialog;
