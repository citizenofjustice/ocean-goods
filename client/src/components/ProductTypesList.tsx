import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductTypes } from "../api";
import { ProductType } from "../types/ProductType";
import LoadingSpinner from "./UI/LoadingSpinner";

const ProductTypesList = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["product-type"],
    queryFn: async () => {
      const data = await getProductTypes();
      setProductTypes(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (isError) return <div>{error.message}</div>;
  return (
    <>
      <div className="text-center w-fit">
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <div>
            <p className="font-bold">Список типов продуктов:</p>
            <ul>
              {productTypes.map((item: ProductType) => (
                <li key={item.productTypeId}>{item.type}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductTypesList;
