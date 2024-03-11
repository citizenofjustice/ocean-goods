import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./UI/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/form";
import { Input } from "./UI/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./UI/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodProductTypeForm } from "../lib/zodProductTypeForm";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./UI/drawer";

interface ProductTypeDialogProps {
  form: UseFormReturn<z.infer<typeof zodProductTypeForm>>;
  children: React.ReactNode;
  onSubmit: (values: z.infer<typeof zodProductTypeForm>) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ProductTypeDialog: React.FC<ProductTypeDialogProps> = ({
  form,
  children,
  onSubmit,
  isOpen,
  onClose,
  onOpen,
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
            <DialogTitle>Введите название типа продукта</DialogTitle>
          </DialogHeader>
          <ProductTypeForm form={form} onSubmit={onSubmit} />
          <DialogFooter>
            <Button form="type-add-form" type="submit">
              Добавить тип
            </Button>
            <DialogClose asChild>
              <Button onClick={onClose} type="button" variant="outline">
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
          <DrawerTitle>Введите название типа продукта</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <ProductTypeForm form={form} onSubmit={onSubmit} />
        </div>
        <DrawerFooter className="pt-4">
          <Button form="type-add-form" type="submit">
            Добавить тип
          </Button>
          <DrawerClose asChild>
            <Button onClick={onClose} type="button" variant="outline">
              Отмена
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ProductTypeForm: React.FC<{
  form: UseFormReturn<z.infer<typeof zodProductTypeForm>>;
  onSubmit: (values: z.infer<typeof zodProductTypeForm>) => void;
}> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form id="type-add-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип продукта:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProductTypeDialog;
