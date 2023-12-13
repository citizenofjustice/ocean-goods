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

  addCatalogItem(item: CatalogItem) {
    this.catalogItems?.push(
      new CatalogItemModel(
        item.id,
        item.productName,
        item.productTypeId,
        item.inStoke,
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
