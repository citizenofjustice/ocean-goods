import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/UI/shadcn/card";

import { ProductType } from "@/types/ProductType";
import ErrorPage from "@/components/Pages/ErrorPage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useProductTypes } from "@/hooks/useProductTypes";
import ProductTypeItem from "@/components/ProductTypeItem";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { zodProductTypeForm } from "@/lib/zodProductTypeForm";
import ProductTypeDialog from "@/components/ProductTypeDialog";

const ProductTypesListPage = () => {
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
              <CardHeader className="font-medium">
                <div className="flex w-full items-center justify-between">
                  <p className="font-medium">Список типов продуктов:</p>
                  <ProductTypeDialog
                    form={form}
                    onSubmit={onSubmit}
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onOpen={() => setIsDialogOpen(true)}
                  >
                    <PlusCircleIcon className="text-primary-800 h-8 w-8 hover:cursor-pointer" />
                  </ProductTypeDialog>
                </div>
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

export default ProductTypesListPage;
