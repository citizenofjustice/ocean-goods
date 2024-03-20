import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/UI/shadcn/button";
import { Switch } from "@/components/UI/shadcn/switch";
import { Textarea } from "@/components/UI/shadcn/textarea";

import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ImageDropzone from "@/components/UI/ImageDropzone";
import { zodCatalogItemForm } from "@/lib/zodCatalogItemForm";
import { CatalogItemInputs } from "@/types/CatalogItemInputs";
import { ButtonLoading } from "@/components/UI/ButtonLoading";
import ProductTypeSelect from "@/components/ProductTypeSelect";
import ConfirmActionAlert from "@/components/UI/ConfirmActionAlert";
import CatalogItemFormInputs from "@/components/UI/CatalogItemFormInputs";

const emptyInitValues: CatalogItemInputs = {
  productName: "",
  productTypeId: "",
  inStock: false,
  description: "",
  price: "",
  discount: "",
  weight: "",
  kcal: "",
  mainImage: undefined,
};

const CatalogItemFormPage: React.FC<{
  actionType?: "CREATE" | "UPDATE";
  editItemId?: number;
  editInitValues?: CatalogItemInputs;
}> = observer(
  ({ actionType = "CREATE", editItemId = undefined, editInitValues }) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
    const { alert } = useStore();

    // Define your form.
    const form = useForm<z.infer<typeof zodCatalogItemForm>>({
      resolver: zodResolver(zodCatalogItemForm),
      defaultValues: {
        productName: editInitValues
          ? editInitValues.productName
          : emptyInitValues.productName,
        productTypeId: editInitValues
          ? editInitValues.productTypeId
          : emptyInitValues.productTypeId,
        inStock: editInitValues
          ? editInitValues.inStock
          : emptyInitValues.inStock,
        description: editInitValues
          ? editInitValues.description
          : emptyInitValues.description,
        price: editInitValues ? editInitValues.price : emptyInitValues.price,
        discount: editInitValues
          ? editInitValues.discount
          : emptyInitValues.discount,
        weight: editInitValues ? editInitValues.weight : emptyInitValues.weight,
        kcal: editInitValues ? editInitValues.kcal : emptyInitValues.kcal,
        mainImage: editInitValues
          ? editInitValues.mainImage
          : emptyInitValues.mainImage,
      },
    });

    async function onSubmit(values: z.infer<typeof zodCatalogItemForm>) {
      const fData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        fData.append(key, value);
      }
      setIsPending(true);
      switch (actionType) {
        case "CREATE": {
          try {
            const response = await axiosPrivate.post(`/catalog/create`, fData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 201)
              alert.setPopup({
                message: "Продукт был успешно добавлен в каталог",
                type: "success",
              });
            navigate("/");
            form.reset();
          } catch (error) {
            if (error instanceof AxiosError)
              alert.setPopup({
                message: error.response?.data.error.message,
                type: "error",
              });
          }
          setIsPending(false);
          break;
        }
        case "UPDATE": {
          if (!editItemId) {
            alert.setPopup({
              message: "Не обнаружен идентификатор редактируемого продукта",
              type: "error",
            });
            throw new Error(
              "Не обнаружен идентификатор редактируемого продукта",
            );
          }

          try {
            const response = await axiosPrivate.put(
              `/catalog/${editItemId}`,
              fData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              },
            );
            if (response.status === 204)
              alert.setPopup({
                message: "Продукт был успешно обновлен",
                type: "success",
              });
            queryClient.removeQueries({
              queryKey: ["catalog-item-edit", editItemId],
              exact: true,
            });
            navigate("/");
          } catch (error) {
            if (error instanceof AxiosError)
              alert.setPopup({
                message: error.response?.data.error.message,
                type: "error",
              });
          }
          setIsPending(false);
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    }

    return (
      <>
        <div className="mb-6 mt-6 flex w-full justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full max-w-4xl gap-x-4 gap-y-4 px-4 vsm:grid-cols-2 sm:w-[80vw] sm:gap-x-8"
            >
              <ProductTypeSelect control={form.control} />
              <CatalogItemFormInputs control={form.control} />
              <ImageDropzone
                control={form.control}
                fieldReset={() =>
                  form.resetField("mainImage", { defaultValue: "" })
                }
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Описание:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Введте описание продукта"
                        rows={2}
                        className="min-h-[140px]"
                        id="description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="product-is-stock-toggle">
                      Имеется в наличии:
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Switch
                          id="product-is-stock-toggle"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <p className="text-sm">
                          {field.value ? "В наличии" : "Нет в наличии"}
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-center">
                {isPending ? (
                  <ButtonLoading />
                ) : (
                  <ConfirmActionAlert
                    onConfirm={form.handleSubmit(onSubmit)}
                    question="Вы уверены что хотите сохранить введеные данные?"
                  >
                    <Button
                      className="px-8"
                      type="button"
                      aria-label="Сохранить продукт"
                    >
                      Сохранить
                    </Button>
                  </ConfirmActionAlert>
                )}
              </div>
            </form>
          </Form>
        </div>
      </>
    );
  },
);
export default CatalogItemFormPage;
