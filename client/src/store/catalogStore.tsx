import { makeAutoObservable, action, observable, computed } from "mobx";
import CatalogItemModel from "../classes/CatalogItemModel";
import { CatalogItem } from "../types/CatalogItem";

class CatalogStore {
  catalogItems: CatalogItemModel[] = [];

  get itemCounter(): number {
    return this.catalogItems.length;
  }

  get catalogItemsProductIds(): Array<number> {
    if (!Array.isArray(this.catalogItems)) {
      throw new Error("catalogItems is not an array");
    }

    const ids = this.catalogItems.map((item) => {
      if (typeof item.productId !== "number") {
        throw new Error("productId is not a number");
      }
      return item.productId;
    });

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
