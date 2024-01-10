import { makeAutoObservable, action } from "mobx";
import CatalogItemModel from "../classes/CatalogItemModel";
import { CatalogItem } from "../types/CatalogItem";

class CatalogStore {
  catalogItems: CatalogItemModel[] = [];

  get itemCounter(): number {
    return this.catalogItems.length;
  }

  get catalogItemsProductIds(): Array<number> {
    const ids = this.catalogItems.map((item) => item.productId);
    return ids;
  }

  constructor() {
    makeAutoObservable(this, {
      setCatalogItems: action,
      addCatalogItem: action,
      removeCatalogItemFromStore: action,
    });
  }

  removeCatalogItemFromStore(productId: number) {
    const filteredCatalog = this.catalogItems.filter(
      (item) => item.productId !== productId
    );
    this.catalogItems = filteredCatalog;
  }

  setCatalogItems(catalog: CatalogItemModel[]) {
    this.catalogItems = catalog;
  }

  addCatalogItem(item: CatalogItem) {
    this.catalogItems?.push(
      new CatalogItemModel(
        item.productId,
        item.productName,
        item.productTypeId,
        item.inStock,
        item.description,
        item.weight,
        item.price,
        item.discount,
        item.kcal,
        item.mainImage
      )
    );
  }
}

export default new CatalogStore();
