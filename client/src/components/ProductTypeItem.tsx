import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ProductType } from "../types/ProductType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProductType, updateProductType } from "../api";
import { useState } from "react";

const ProductTypeItem: React.FC<{
  productType: ProductType;
}> = ({ productType }) => {
  const queryClient = useQueryClient();
  const [isInEdit, setIsInEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(productType.type);

  const removeMutation = useMutation({
    mutationFn: async (productTypeId: number) =>
      await removeProductType(productTypeId),
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
    mutationFn: async (productType: ProductType) =>
      await updateProductType(productType),
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
      <li className="flex bg-amber-50 rounded-lg items-center my-4 py-4 px-2 h-16 w-full gap-2">
        {isInEdit ? (
          <div className="basis-10/12">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 h-10"
            />
          </div>
        ) : (
          <p className="text-start justify-items-start basis-10/12 px-2">
            {productType.type}
          </p>
        )}
        <div className="flex items-center basis-2/12 justify-center">
          <div className="flex flex-col items-center justify-center">
            {isInEdit && (
              <div className="border border-black border-svg rounded-full hover:cursor-pointer">
                <XMarkIcon
                  onClick={() => setIsInEdit(false)}
                  className="w-4 h-4"
                />
              </div>
            )}
            <div onClick={editModeHandler}>
              {isInEdit ? (
                <CheckCircleIcon className="w-6 h-6 hover:cursor-pointer" />
              ) : (
                <PencilSquareIcon className="w-6 h-6 hover:cursor-pointer" />
              )}
            </div>
          </div>
          <TrashIcon
            onClick={() => removeMutation.mutate(productType.productTypeId)}
            className="w-6 h-6 hover:cursor-pointer"
          />
        </div>
      </li>
    </>
  );
};

export default ProductTypeItem;
