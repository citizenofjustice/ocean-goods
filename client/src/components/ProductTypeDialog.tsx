import { z } from "zod";
import { useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/UI/shadcn/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/shadcn/dialog";
import { UseFormReturn } from "react-hook-form";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

import { Input } from "@/components/UI/shadcn/input";
import { Button } from "@/components/UI/shadcn/button";
import { zodProductTypeForm } from "@/lib/zodProductTypeForm";

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
              Сохранить
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
