import { makeAutoObservable, action, observable, computed } from "mobx";
import CatalogItemModel from "../classes/CatalogItemModel";
import { CatalogItem } from "../types/CatalogItem";

const cartItemsFromLStorage: CatalogItemModel[] = JSON.parse(
  localStorage.getItem("catalog") || "[]"
);

class CatalogStore {
  catalogItems: CatalogItemModel[] = cartItemsFromLStorage;

  get itemCounter(): number {
    return this.catalogItems.length;
  }

  get catalogItemsProductIds(): Array<number> {
    const ids = this.catalogItems.map((item) => item.productId);
    return ids;
  }

  constructor() {
    makeAutoObservable(this, {
      catalogItems: observable,
      itemCounter: computed,
      catalogItemsProductIds: computed,
      setCatalogItems: action,
      addCatalogItem: action,
      removeCatalogItemFromStore: action,
    });
  }

  findCatalogItemById(productId: number) {
    const foundItem = this.catalogItems.find(
      (item) => item.productId === productId
    );
    return foundItem;
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
