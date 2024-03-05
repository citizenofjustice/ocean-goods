import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductTypesSelectValues } from "../api/index";
import { AxiosError } from "axios";
import { useStore } from "../store/root-store-context";
import { z } from "zod";
import { zodCatalogItemForm } from "../lib/zodCatalogItemForm";

interface SelectValueProp {
  id: string;
  optionValue: string;
}

interface ProductTypeSelectProps {
  control: Control<z.infer<typeof zodCatalogItemForm>>;
}

interface ProductTypeSelectOption {
  productTypeId: string;
  type: string;
}

const ProductTypeSelect: React.FC<ProductTypeSelectProps> = ({ control }) => {
  const { alert } = useStore();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["product-type-select"],
    queryFn: async () => {
      const data = await getProductTypesSelectValues();
      if (data instanceof AxiosError) {
        alert.setPopup({
          message: "Не удалось загрузить типы продуктов",
          type: "error",
        });
      } else {
        const availableRoles = data.map((item: ProductTypeSelectOption) => {
          const selectValue: SelectValueProp = {
            id: item.productTypeId,
            optionValue: item.type,
          };
          return selectValue;
        });
        return availableRoles;
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <FormField
      control={control}
      name="productTypeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Тип продука:</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? (
                      <Loader2 className="w-4 h-4" />
                    ) : (
                      "Выберите тип продукта"
                    )
                  }
                />
              </SelectTrigger>
            </FormControl>
            <FormMessage />
            {!isLoading && !isError && (
              <SelectContent>
                {data.map((item: SelectValueProp) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.optionValue}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </FormItem>
      )}
    />
  );
};

export default ProductTypeSelect;
