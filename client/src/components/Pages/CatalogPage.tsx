import { observer } from "mobx-react-lite";
import { useStore } from "../../store/root-store-context";

import Grid from "../UI/Grid";
import ItemCard from "../ItemCard";
import GridElement from "../UI/GridElement";

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  const { catalog } = useStore();
  const { catalogItems } = catalog;

  return (
    <div className="px-2 vsm:px-4">
      <Grid xCount="2">
        {catalogItems.map((item) => (
          <GridElement key={item.productId}>
            <ItemCard catalogItem={item} />
          </GridElement>
        ))}
      </Grid>
    </div>
  );
});

export default CatalogPage;
