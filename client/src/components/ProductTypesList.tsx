import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductTypes } from "../api";
import { ProductType } from "../types/ProductType";
import LoadingSVG from "./UI/LoadingSVG";

const ProductTypesList = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["product-type"],
    queryFn: async () => {
      const data = await getProductTypes();
      setProductTypes(data);
      return data;
    },
  });

  if (isError) return <div>{error.message}</div>;
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-10 h-10">
            <LoadingSVG className="w-10 h-10" />
          </div>
        </div>
      )}
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
    </>
  );
};

export default ProductTypesList;
