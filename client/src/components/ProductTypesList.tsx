import { useQuery } from "@tanstack/react-query";
import { getProductTypes } from "../api";
import { ProductType } from "../types/ProductType";
import LoadingSpinner from "./UI/LoadingSpinner";
import ProductTypeItem from "./ProductTypeItem";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ProductTypeAdd from "./ProductTypeAdd";
import FormCard from "./UI/FormCard";

const ProductTypesList = () => {
  const [isFormShown, setIsFormShown] = useState(false);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["product-type"],
    queryFn: async () => {
      const data = await getProductTypes();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <FormCard>
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <>
            <div className="w-full flex justify-center relative">
              <p className="font-bold">Список типов продуктов:</p>
              {!isFormShown && (
                <div className="absolute right-0">
                  <PlusCircleIcon
                    onClick={() => setIsFormShown(true)}
                    className="w-6 h-6 hover:cursor-pointer "
                  />
                </div>
              )}
            </div>
            <ul>
              {isFormShown && (
                <li>
                  <ProductTypeAdd
                    onAdditionCancel={() => setIsFormShown(false)}
                  />
                </li>
              )}
              {data.length !== 0 ? (
                data.map((item: ProductType) => (
                  <ProductTypeItem
                    key={item.productTypeId}
                    productType={item}
                  />
                ))
              ) : (
                <h1 className="mt-4">Список типов продуктов пуст</h1>
              )}
            </ul>
          </>
        )}
      </FormCard>
    </>
  );
};

export default ProductTypesList;
