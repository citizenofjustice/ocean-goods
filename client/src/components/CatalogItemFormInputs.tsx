import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./UI/form";
import { Input } from "./UI/input";
import { z } from "zod";
import { zodCatalogItemForm } from "src/lib/zodCatalogItemForm";

interface CatalogInput {
  name:
    | "productName"
    | "productTypeId"
    | "inStock"
    | "description"
    | "price"
    | "discount"
    | "weight"
    | "kcal"
    | "mainImage";
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
