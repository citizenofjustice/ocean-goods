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
import { PlusCircleIcon } from "lucide-react";

interface ProductTypeDialogProps {
  form: UseFormReturn<z.infer<typeof zodProductTypeForm>>;
  onSubmit: (values: z.infer<typeof zodProductTypeForm>) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ProductTypeDialog: React.FC<ProductTypeDialogProps> = ({
  form,
  onSubmit,
  isOpen,
  onClose,
  onOpen,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="link" onClick={onOpen}>
          <PlusCircleIcon className="w-8 h-8 text-primary-800 hover:cursor-pointer " />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Введите название типа продукта</DialogTitle>
        </DialogHeader>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button form="type-add-form" type="submit">
            Добавить тип
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTypeDialog;
