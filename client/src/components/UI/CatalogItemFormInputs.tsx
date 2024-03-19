import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/UI/shadcn/form";
import { Control } from "react-hook-form";
import { Input } from "@/components/UI/shadcn/input";

import { zodCatalogItemForm } from "@/lib/zodCatalogItemForm";

interface CatalogInput {
  name: "productName" | "price" | "discount" | "weight" | "kcal";
  label: string;
  type: string;
  placeholder?: string;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
}

const formInputs: CatalogInput[] = [
  {
    name: "productName",
    label: "Наименование продукта",
    type: "text",
  },
  {
    name: "price",
    label: "Цена",
    type: "text",
  },
  {
    name: "discount",
    label: "Скидка",
    type: "text",
  },
  {
    name: "weight",
    label: "Вес (в граммах)",
    type: "text",
  },
  {
    name: "kcal",
    label: "Ккал (на 100 гр.)",
    type: "text",
  },
];

const CatalogItemFormInputs: React.FC<{
  control: Control<z.infer<typeof zodCatalogItemForm>>;
}> = ({ control }) => {
  return (
    <>
      {formInputs.map((input: CatalogInput, index) => (
        <FormField
          key={index}
          control={control}
          name={input.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{input.label}:</FormLabel>
              <FormControl>
                <Input type={input.type} {...field} {...input.inputAttr} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default CatalogItemFormInputs;
