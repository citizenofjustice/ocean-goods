import { makeAutoObservable } from "mobx";

import { BasicImage } from "@/types/BasicImage";
import { CatalogItem } from "@/types/CatalogItem";

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
  mainImage?: BasicImage;

  // Getter to calculate the final price after discount
  get finalPrice(): number {
    return this.price - Math.round(this.price * (this.discount / 100));
  }

  // Constructor for the CatalogItemModel class
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
    mainImage?: BasicImage
  ) {
    // Making all properties of this class observable for reactive programming
    makeAutoObservable(this);
    // Assigning values to properties
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
