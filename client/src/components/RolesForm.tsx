import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/UI/shadcn/input";
import { Checkbox } from "@/components/UI/shadcn/checkbox";
import { ScrollArea } from "@/components/UI/shadcn/scroll-area";

import { Privelege } from "@/types/Privelege";
import { zodRolesForm } from "@/lib/zodRolesForm";

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
                          className="my-3 flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                privelege.privelegeId,
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
                                          value !== privelege.privelegeId,
                                      ),
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

export default RolesForm;
