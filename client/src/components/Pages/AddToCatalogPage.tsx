import { z } from "zod";
import { observer } from "mobx-react-lite";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CatalogItemInputs } from "../../types/form-types";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodInputStringPipe } from "../../lib/utils";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useStore } from "../../store/root-store-context";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductTypesSelectValues } from "../../api";
import { AxiosError } from "axios";
import { SelectValueProp } from "../../types/SelectValue";
import { zodImageFile } from "../../lib/zodImageFile";
import { ButtonLoading } from "../ui/ButtonLoading";
import { Card } from "../ui/card";

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

const emptyInitValues: CatalogItemInputs = {
  productName: "",
  productTypeId: "",
  inStock: false,
  description: "",
  price: "",
  discount: "",
  weight: "",
  kcal: "",
  mainImage: "",
};

interface ProductTypeSelectOption {
  productTypeId: string;
  type: string;
}

const AddToCatalogPage: React.FC<{
  actionType?: "CREATE" | "UPDATE";
  editItemId?: number;
  initValues?: CatalogItemInputs;
}> = observer(
  ({
    actionType = "CREATE",
    editItemId = undefined,
    initValues = emptyInitValues,
  }) => {
    const [inputValues, setInputValues] =
      useState<CatalogItemInputs>(initValues);
    const axiosPrivate = useAxiosPrivate();
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
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

    const formSchema = z.object({
      productName: z
        .string()
        .min(2, { message: "Слишком короткое наименование" }),
      productTypeId: z.string().min(1, { message: "Укажите тип продукта" }),
      inStock: z.boolean(),
      description: z.string(),
      price: zodInputStringPipe(
        z.number().positive("Значение должно быть больше 0")
      ),
      discount: zodInputStringPipe(
        z
          .number()
          .min(0, { message: "Значение должно быть больше 0" })
          .max(100, { message: "Значение не должно быть больше 100" })
      ),
      weight: zodInputStringPipe(
        z.number().positive("Значение должно быть больше 0")
      ),
      kcal: zodInputStringPipe(
        z.number().positive("Значение должно быть больше 0")
      ),
      mainImage: zodImageFile,
    });

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        productName: "",
        productTypeId: "",
        inStock: false,
        description: "",
        price: "",
        discount: "",
        weight: "",
        kcal: "",
        mainImage: undefined,
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
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
            setInputValues(emptyInitValues);
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
          const isInputImageValueEmpty =
            inputValues.mainImage === undefined || inputValues.mainImage === "";

          if (isInputImageValueEmpty || inputValues.mainImage instanceof File) {
            // in case of input field containing File
          } else {
            // if new image file was not added, replace field in formdata
            fData.set("mainImage", `${inputValues.mainImage}`);
          }

          if (!editItemId) {
            alert.setPopup({
              message: "Не обнаружен идентификатор редактируемого продукта",
              type: "error",
            });
            throw new Error(
              "Не обнаружен идентификатор редактируемого продукта"
            );
          }

          try {
            const response = await axiosPrivate.put(
              `/catalog/${editItemId}`,
              fData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            if (response.status === 204)
              alert.setPopup({
                message: "Продукт был успешно обновлен",
                type: "success",
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
        <div className="w-full mt-6 mb-6 flex justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full px-4 gap-x-4 sm:w-[80vw] max-w-4xl grid vsm:grid-cols-2 sm:gap-x-8 gap-y-4"
            >
              <FormField
                control={form.control}
                name="productTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип продука:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              {formInputs.map((input: CatalogInput, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={input.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{input.label}:</FormLabel>
                      <FormControl>
                        <Input
                          type={input.type}
                          {...field}
                          {...input.inputAttr}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="mainImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Изображение:</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                          id="fileInput"
                          className="hidden"
                          multiple
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                    <label htmlFor="fileInput">
                      <Card className="mt-2 flex h-28 flex-col items-center justify-center">
                        {field.value ? (
                          <span className="flex justify-center w-[100%] h-[100%]">
                            <img
                              className="max-w-[100%] max-h-[100%] py-2"
                              src={URL.createObjectURL(field.value)}
                            />
                            <Button variant="ghost" type="button">
                              <X className="relative z-40 top-0 left-0 w-6 h-6" />
                            </Button>
                          </span>
                        ) : (
                          <>
                            <UploadCloud
                              strokeWidth={0.95}
                              className="w-10 h-10"
                            />
                            <p className="mb-2 px-4 text-center">
                              <span className="font-semibold">
                                Нажмите чтобы загрузить файл
                              </span>
                            </p>
                          </>
                        )}
                      </Card>
                    </label>
                  </FormItem>
                )}
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
                        rows={5}
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
                  <FormItem>
                    <FormLabel>Имеется в наличии:</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-center">
                {isPending ? (
                  <ButtonLoading />
                ) : (
                  <Button className="px-8" type="submit">
                    Сохранить
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </>
    );
  }
);
export default AddToCatalogPage;
