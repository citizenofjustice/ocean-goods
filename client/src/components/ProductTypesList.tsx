import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import FormCard from "./UI/FormCard";
import ErrorPage from "./Pages/ErrorPage";
import ProductTypeAdd from "./ProductTypeAdd";
import ProductTypeItem from "./ProductTypeItem";
import LoadingSpinner from "./UI/LoadingSpinner";
import { ProductType } from "../types/ProductType";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProductTypesList = () => {
  // Using custom hook to get an instance of axios with credentials
  const axiosPrivate = useAxiosPrivate();
  // Local state for managing visibility of the form
  const [isFormShown, setIsFormShown] = useState(false);

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

  return (
    <>
      {!isError && (
        <FormCard>
          {isLoading && <LoadingSpinner />}
          {!isLoading && !isError && (
            <>
              <div className="w-full flex justify-center items-center relative">
                <p className="font-medium w-3/5">Список типов продуктов:</p>
                {!isFormShown && (
                  <div className="absolute right-0">
                    <PlusCircleIcon
                      onClick={() => setIsFormShown(true)}
                      className="w-8 h-8 text-primary-800 hover:cursor-pointer "
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
              </ul>
            </>
          )}
        </FormCard>
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
