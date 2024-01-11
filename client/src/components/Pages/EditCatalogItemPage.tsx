import { useParams } from "react-router-dom";
import AddToCatalogPage from "./AddToCatalogPage";
import { useStore } from "../../store/root-store-context";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { useEffect, useState } from "react";
import { CatalogItemInputs } from "../../types/form-types";

const EditCatalogItemPage = () => {
  const { id } = useParams();
  const { catalog } = useStore();
  const [beforeEditData, setBeforeEditData] = useState<CatalogItemInputs>();
  const itemId = id ? parseInt(id) : undefined;

  useEffect(() => {
    if (itemId) {
      const thisItemData: CatalogItemModel | undefined =
        catalog.findCatalogItemById(itemId);
      if (thisItemData) {
        setBeforeEditData({
          productName: thisItemData.productName,
          productTypeId: thisItemData.productTypeId.toString(),
          inStock: thisItemData.inStock,
          description: thisItemData.description,
          price: thisItemData.price.toString(),
          discount: thisItemData.discount.toString(),
          weight: thisItemData.weight.toString(),
          kcal: thisItemData.kcal.toString(),
          mainImage: thisItemData.mainImage,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1 className="text-center">
        Страница для редактирования продукта: ID-{id}
      </h1>
      {beforeEditData && (
        <AddToCatalogPage
          actionType="UPDATE"
          editItemId={itemId}
          initValues={beforeEditData}
        />
      )}
    </>
  );
};

export default EditCatalogItemPage;
