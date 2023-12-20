import { makeAutoObservable } from "mobx";
import CatalogItemModel from "../classes/CatalogItemModel";
import { CatalogItem } from "../types/CatalogItem";

class CatalogStore {
  catalogItems: CatalogItemModel[] = [];

  get itemCouter(): number {
    return this.catalogItems.length;
  }

  constructor() {
    makeAutoObservable(this);
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
