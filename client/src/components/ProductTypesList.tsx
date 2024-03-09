import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./Pages/ErrorPage";
import ProductTypeItem from "./ProductTypeItem";
import LoadingSpinner from "./ui/LoadingSpinner";
import { ProductType } from "../types/ProductType";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zodProductTypeForm } from "../lib/zodProductTypeForm";
import ProductTypeDialog from "./ProductTypeDialog";
import { useProductTypes } from "../hooks/useProductTypes";
import { useState } from "react";

const ProductTypesList = () => {
  // Using custom hook to get an instance of axios with credentials
  const axiosPrivate = useAxiosPrivate();
  // Define your form.
  const form = useForm<z.infer<typeof zodProductTypeForm>>({
    resolver: zodResolver(zodProductTypeForm),
    defaultValues: {
      type: "",
    },
  });
  const { mutation } = useProductTypes(form);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  async function onSubmit(values: z.infer<typeof zodProductTypeForm>) {
    const fData = new FormData();
    fData.append("type", values.type);
    mutation.mutate(fData);
    setIsDialogOpen(false);
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
                    <ProductTypeDialog
                      form={form}
                      onSubmit={onSubmit}
                      isOpen={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      onOpen={() => setIsDialogOpen(true)}
                    />
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
