import { observer } from "mobx-react-lite";
// import { useStore } from "../../store/root-store-context";

import Grid from "../UI/Grid";
import ItemCard from "../ItemCard";
import GridElement from "../UI/GridElement";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "../../api";
import CatalogItemModel from "../../classes/CatalogItemModel";
import LoadingSVG from "../UI/LoadingSVG";

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  // const { catalog } = useStore();
  // const { catalogItems } = catalog;

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => getCatalog(),
    refetchOnWindowFocus: false,
  });

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
          {data.length > 0 &&
            data.map((item: CatalogItemModel) => (
              <GridElement key={item.id}>
                <ItemCard catalogItem={item} />
              </GridElement>
            ))}
        </Grid>
      )}
    </div>
  );
});

export default CatalogPage;
