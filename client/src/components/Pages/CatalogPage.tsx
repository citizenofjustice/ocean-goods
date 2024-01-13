import { observer } from "mobx-react-lite";
import { useStore } from "../../store/root-store-context";

import Grid from "../UI/Grid";
import ItemCard from "../ItemCard";
import GridElement from "../UI/GridElement";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "../../api";
import CatalogItemModel from "../../classes/CatalogItemModel";
import LoadingSVG from "../UI/LoadingSVG";
import { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  const { catalog, cart } = useStore();
  const { catalogItems } = catalog;
  const [, setCatalogStorage] = useLocalStorage("catalog", catalogItems);

  const { isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const data = await getCatalog();
      catalog.setCatalogItems(data);
      setCatalogStorage(data);
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
    <div className="px-2 vsm:px-4">
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-10 h-10">
            <LoadingSVG className="w-10 h-10" />
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <Grid xCount="2">
          {catalogItems.length > 0 &&
            catalogItems.map((item: CatalogItemModel) => (
              <GridElement key={item.productId}>
                <ItemCard catalogItem={item} />
              </GridElement>
            ))}
        </Grid>
      )}
    </div>
  );
});

export default CatalogPage;
