import { makeAutoObservable } from "mobx";

import { CatalogItem } from "../types/CatalogItem";

// Catalog item class implementing CatalogItem interface
class CatalogItemModel implements CatalogItem {
  productId: number;
  productName: string;
  productTypeId: number;
  inStock: boolean;
  description: string;
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: string;

  get finalPrice(): number {
    return this.price - Math.round(this.price * (this.discount / 100));
  }

  constructor(
    productId: number,
    productName: string,
    productTypeId: number,
    inStock: boolean,
    description: string,
    price: number,
    discount: number,
    weight: number,
    kcal: number,
    mainImage?: string
  ) {
    makeAutoObservable(this);
    this.productId = productId;
    this.productName = productName;
    this.productTypeId = productTypeId;
    this.inStock = inStock;
    this.description = description;
    this.price = price;
    this.discount = discount;
    this.weight = weight;
    this.kcal = kcal;
    this.mainImage = mainImage;
  }
}

export default CatalogItemModel;
