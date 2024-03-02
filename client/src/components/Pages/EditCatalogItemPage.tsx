import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "../../api/axios";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../ui/LoadingSpinner";
import AddToCatalogPage from "./AddToCatalogPage";
import { CatalogItemInputs } from "../../types/form-types";

const EditCatalogItemPage = observer(() => {
  const { id } = useParams(); // Get the item ID from the route parameters
  const [beforeEditData, setBeforeEditData] = useState<CatalogItemInputs>(); // State to hold the item data before editing

  // Check if 'id' is a valid number before parsing
  const itemId = id && !isNaN(Number(id)) ? parseInt(id) : undefined;

  // Use React Query to fetch the item data
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["catalog-item-edit", itemId], // Unique key for the query and dependancy for refetching
    queryFn: async () => {
      try {
        if (!itemId)
          throw new Error(
            `Could not get 'id' request parameter for getting edit data`
          );
        const response = await axios.get(`/catalog/${itemId}`);
        return {
          productName: response.data.productName,
          productTypeId: response.data.productTypeId.toString(),
          inStock: response.data.inStock,
          description: response.data.description,
          price: response.data.price.toString(),
          discount: response.data.discount.toString(),
          weight: response.data.weight.toString(),
          kcal: response.data.kcal.toString(),
          mainImage: response.data.mainImage,
        };
      } catch (error) {
        console.error(error);
        throw error; // re-throw the error so it can be caught by isError in useQuery
      }
    },
    refetchOnWindowFocus: false,
  });

  // Use useEffect to update the state when data changes
  useEffect(() => {
    if (data) {
      // Set the initial form values to the fetched data
      setBeforeEditData(data);
    }
  }, [data]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && beforeEditData && !isError && (
        <AddToCatalogPage
          actionType="UPDATE"
          editItemId={itemId}
          initValues={beforeEditData}
        />
      )}
      {isError && (
        <div className="p-4">
          <ErrorPage
            error={error}
            customMessage="Произошла ошибка при загрузке редактируемого продукта"
          />
        </div>
      )}
    </>
  );
});

export default EditCatalogItemPage;
