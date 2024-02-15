import { observer } from "mobx-react-lite";
import { useStore } from "../../store/root-store-context";

import ItemCard from "../ItemCard";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "../../api";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { useEffect } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { CatalogItem } from "../../types/CatalogItem";

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  const { catalog, cart } = useStore();
  const { catalogItems } = catalog;
  const { isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const data = await getCatalog();
      const fetchedCatalogItems = data.map(
        (item: CatalogItem) =>
          new CatalogItemModel(
            item.productId,
            item.productName,
            item.productTypeId,
            item.inStock,
            item.description,
            item.price,
            item.discount,
            item.weight,
            item.kcal,
            item.mainImage
          )
      );
      catalog.setCatalogItems(fetchedCatalogItems);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const isFirstQuery = isFetching && isLoading;

  useEffect(() => {
    if (!isFirstQuery) {
      cart.compare(catalog.catalogItemsProductIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstQuery]);

  if (isError) return <div>{error.message}</div>;

  return (
    <div className="p-4">
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <div className="grid gap-4 vsm:grid-cols-2 sm:grid-cols-3 sm:max-w-screen-lg m-auto">
          {catalogItems.length > 0 &&
            catalogItems.map((item: CatalogItemModel) => (
              <div
                key={item.productId}
                className="flex flex-col gap-1 items-center justify-between bg-background-100 border-background-200 border-2 rounded-lg"
              >
                <ItemCard catalogItem={item} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
});

export default CatalogPage;
