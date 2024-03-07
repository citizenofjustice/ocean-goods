import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import ErrorPage from "./Pages/ErrorPage";
import ProductTypeItem from "./ProductTypeItem";
import LoadingSpinner from "./ui/LoadingSpinner";
import { ProductType } from "../types/ProductType";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zodProductTypeForm } from "../lib/zodProductTypeForm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";

const ProductTypesList = () => {
  // Using custom hook to get an instance of axios with credentials
  const axiosPrivate = useAxiosPrivate();

  // Using useQuery hook to fetch product types
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["product-type"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/product-types`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  // prevent potential errors if the request fails and data is undefined
  const dataAvailable = data !== null && data !== undefined;

  // Define your form.
  const form = useForm<z.infer<typeof zodProductTypeForm>>({
    resolver: zodResolver(zodProductTypeForm),
    defaultValues: {
      type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof zodProductTypeForm>) {
    console.log(values);
  }

  return (
    <>
      {!isError && (
        <Card className="mt-4 w-full">
          {isLoading && <LoadingSpinner />}
          {!isLoading && !isError && (
            <>
              <div className="">
                <CardHeader className="font-medium">
                  <span className="flex justify-between items-center">
                    Список типов продуктов:
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link">
                          <PlusCircleIcon className="w-8 h-8 text-primary-800 hover:cursor-pointer " />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col">
                        <DialogHeader>
                          <DialogTitle>
                            Введите название типа продукта
                          </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            id="type-add-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                          >
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
                            <Button type="button" variant="outline">
                              Отмена
                            </Button>
                          </DialogClose>
                          <Button form="type-add-form" type="submit">
                            Добавить тип
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </span>
                </CardHeader>
                <CardContent>
                  {dataAvailable && data.length > 0 ? (
                    data.map((item: ProductType) => (
                      <ProductTypeItem
                        key={item.productTypeId}
                        productType={item}
                      />
                    ))
                  ) : (
                    <h1 className="mt-4">Список типов продуктов пуст</h1>
                  )}
                </CardContent>
              </div>
              <ul></ul>
            </>
          )}
        </Card>
      )}
      {isError && (
        <ErrorPage
          error={error}
          customMessage="При загрузке списка типов продуктов произошла ошибка"
        />
      )}
    </>
  );
};

export default ProductTypesList;
