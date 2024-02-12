import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ProductType } from "../types/ProductType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 hover:border-accent-700
disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500`;

const ProductTypeItem: React.FC<{
  productType: ProductType;
}> = ({ productType }) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [isInEdit, setIsInEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(productType.type);

  const removeMutation = useMutation({
    mutationFn: async (productTypeId: number) => {
      const response = await axiosPrivate.delete(
        `/product-types/${productTypeId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["product-type"], (oldData: ProductType[]) => {
        const newData = oldData.filter(
          (item) => item.productTypeId !== variables
        );
        return newData;
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProductType: ProductType) => {
      const response = await axiosPrivate.put(
        `/product-types/${updatedProductType.productTypeId}`,
        updatedProductType
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
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
  });

  const editModeHandler = () => {
    if (isInEdit) {
      updateMutation.mutate({
        productTypeId: productType.productTypeId,
        type: inputValue,
      });
    }
    setIsInEdit((prevValue) => !prevValue);
  };

  return (
    <>
      <li className="flex bg-background-50 rounded-lg items-center my-4 py-4 px-2 h-16 w-full gap-2">
        {isInEdit ? (
          <div className="basis-10/12">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`${inputStyles} appearance-none text-text-700 py-3 px-4 rounded leading-tight truncate border border-gray-400 block w-full`}
            />
          </div>
        ) : (
          <p className="text-start justify-items-start basis-10/12 px-2">
            {productType.type}
          </p>
        )}
        <div className="flex items-center basis-2/12 justify-center gap-1">
          <div className="flex flex-col items-center justify-center gap-1">
            {isInEdit && (
              <XCircleIcon
                onClick={() => setIsInEdit(false)}
                className="w-6 h-6 text-primary-800 hover:cursor-pointer"
              />
            )}
            <div onClick={editModeHandler}>
              {isInEdit ? (
                <CheckCircleIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
              ) : (
                <PencilSquareIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
              )}
            </div>
          </div>
          <TrashIcon
            onClick={() => removeMutation.mutate(productType.productTypeId)}
            className="w-6 h-6 text-primary-800 hover:cursor-pointer"
          />
        </div>
      </li>
    </>
  );
};

export default ProductTypeItem;
