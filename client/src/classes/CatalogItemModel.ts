import { makeAutoObservable } from "mobx";

import { CatalogItem } from "../types/CatalogItem";

// Catalog item class implementing CatalogItem interface
class CatalogItemModel implements CatalogItem {
  id: number;
  productName: string;
  productTypeId: number;
  inStoke: boolean;
  description: string;
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: string;

  constructor(
    id: number,
    productName: string,
    productTypeId: number,
    inStoke: boolean,
    description: string,
    price: number,
    discount: number,
    weight: number,
    kcal: number,
    mainImage?: string
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.productName = productName;
    this.productTypeId = productTypeId;
    this.inStoke = inStoke;
    this.description = description;
    this.price = price;
    this.discount = discount;
    this.weight = weight;
    this.kcal = kcal;
    this.mainImage = mainImage;
  }
}

export default CatalogItemModel;
