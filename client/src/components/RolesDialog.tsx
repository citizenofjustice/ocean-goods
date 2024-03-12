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
  FormDescription,
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
import { zodRolesForm } from "../lib/zodRolesForm";
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
import { Checkbox } from "./UI/checkbox";
import { Privelege } from "../types/Privelege";
import { ScrollArea } from "./UI/scroll-area";

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
            <Button form="role-form" type="submit">
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
          <DrawerTitle>Введите данные роли пользователя</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <RolesForm form={form} onSubmit={onSubmit} priveleges={priveleges} />
        </div>
        <DrawerFooter className="pt-4">
          <Button form="role-form" type="submit">
            Сохранить
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

const RolesForm: React.FC<{
  form: UseFormReturn<z.infer<typeof zodRolesForm>>;
  onSubmit: (values: z.infer<typeof zodRolesForm>) => void;
  priveleges: Privelege[];
}> = ({ form, onSubmit, priveleges }) => {
  return (
    <Form {...form}>
      <ScrollArea className="h-[320px] w-full rounded-md border p-4">
        <form
          id="role-form"
          className="px-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel htmlFor="role-title">Наименование роли:</FormLabel>
                <FormControl>
                  <Input id="role-title" autoComplete="on" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privelegeIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel htmlFor="role-priveleges-input">
                    Привилегии:
                  </FormLabel>
                  <FormDescription>
                    Выберите привилегии которые хотите назначить для роли.
                  </FormDescription>
                </div>
                {priveleges.map((privelege) => (
                  <FormField
                    key={privelege.privelegeId}
                    control={form.control}
                    name="privelegeIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={privelege.privelegeId}
                          className="flex flex-row items-start space-x-3 space-y-0 my-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                privelege.privelegeId
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      privelege.privelegeId,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !== privelege.privelegeId
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {privelege.title}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </ScrollArea>
    </Form>
  );
};

export default RolesDialog;
