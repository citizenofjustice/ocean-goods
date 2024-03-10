import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProductType } from "../types/ProductType";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStore } from "../store/root-store-context";
import { AxiosError } from "axios";
import ProductTypeDialog from "./ProductTypeDialog";
import { zodProductTypeForm } from "../lib/zodProductTypeForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmActionAlert from "./UI/ConfirmActionAlert";
import { Button } from "./UI/button";

const ProductTypeItem: React.FC<{
  productType: ProductType;
}> = ({ productType }) => {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof zodProductTypeForm>>({
    resolver: zodResolver(zodProductTypeForm),
    defaultValues: {
      type: productType.type,
    },
  });

  // Mutation for removing a product type
  const removeMutation = useMutation({
    mutationFn: async (productTypeId: number) => {
      const response = await axiosPrivate.delete(
        `/product-types/${productTypeId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // if request was successful modify query data
      queryClient.setQueryData(["product-type"], (oldData: ProductType[]) => {
        const newData = oldData.filter(
          (item) => item.productTypeId !== variables
        );
        return newData;
      });
    },
    onError: (error) => {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При удалении произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  // Mutation for updating a product type
  const updateMutation = useMutation({
    mutationFn: async (updatedProductType: ProductType) => {
      const response = await axiosPrivate.put(
        `/product-types/${updatedProductType.productTypeId}`,
        updatedProductType
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // if request was successful modify query data
      queryClient.setQueryData(["product-type"], (oldData: ProductType[]) => {
        const newData = oldData.map((item) => {
          if (item.productTypeId === variables.productTypeId)
            return {
              productTypeId: variables.productTypeId,
              type: variables.type,
            };
          return item;
        });
        return newData;
      });
    },
    onError: (error) => {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При изменении произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  // Handler for removing product type
  const removeProductTypeHandler = () => {
    if (removeMutation.isPending) return;
    removeMutation.mutate(productType.productTypeId);
  };

  async function onSubmit(values: z.infer<typeof zodProductTypeForm>) {
    if (updateMutation.isPending) return;
    updateMutation.mutate({
      productTypeId: productType.productTypeId,
      type: values.type,
    });
    setIsDialogOpen(false);
  }

  return (
    <>
      <li className="flex bg-background-50 border rounded-lg items-center justify-between my-4 py-4 px-2 h-16 w-full gap-2">
        <p className="text-start justify-items-start px-2">
          {productType.type}
        </p>
        <div className="flex gap-3">
          <ProductTypeDialog
            form={form}
            isOpen={isDialogOpen}
            onOpen={() => setIsDialogOpen(true)}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSubmit}
          >
            <PencilSquareIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
          </ProductTypeDialog>
          <ConfirmActionAlert
            question="Вы уверены что хотите удалить тип продукта?"
            message="Удаление типа продукта повлечет за собой утерю всех записей с данным типом продука в каталоге."
            onConfirm={removeProductTypeHandler}
          >
            <Button className="p-0" variant="link">
              <TrashIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
            </Button>
          </ConfirmActionAlert>
        </div>
      </li>
    </>
  );
};

export default ProductTypeItem;
