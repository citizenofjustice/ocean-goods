import { makeAutoObservable, action, observable, computed } from "mobx";

import { CatalogItem } from "../types/CatalogItem";
import CatalogItemModel from "../classes/CatalogItemModel";

// Class for the catalog store
class CatalogStore {
  // Observable array of catalog items
  catalogItems: CatalogItemModel[] = [];

  // Computed property for the total number of items in the catalog
  get itemCounter(): number {
    return this.catalogItems.length;
  }

  // Computed property for the product IDs of items in the catalog
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

  // Constructor for the CatalogStore class
  constructor() {
    // Making all properties of this class observable and actions for MobX
    makeAutoObservable(this, {
      catalogItems: observable,
      itemCounter: computed,
      catalogItemsProductIds: computed,
      setCatalogItems: action,
      addCatalogItem: action,
      removeCatalogItemFromStore: action,
    });
  }

  // Method to find a catalog item by product ID
  findCatalogItemById(productId: number) {
    const foundItem = this.catalogItems.find(
      (item) => item.productId === productId
    );
    return foundItem;
  }

  // Action to remove an item from the catalog
  removeCatalogItemFromStore(productId: number) {
    try {
      const filteredCatalog = this.catalogItems.filter(
        (item) => item.productId !== productId
      );
      this.catalogItems = filteredCatalog;
    } catch (error) {
      console.error("Failed to remove item from catalog: ", error);
    }
  }

  // Action to set the catalog items
  setCatalogItems(catalog: CatalogItemModel[]) {
    try {
      this.catalogItems = catalog;
    } catch (error) {
      console.error("Failed to set catalog items: ", error);
    }
  }

  // Action to add an item to the catalog
  addCatalogItem(item: CatalogItem) {
    try {
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
    } catch (error) {
      console.error("Failed to add item to catalog: ", error);
    }
  }
}

export default new CatalogStore();
