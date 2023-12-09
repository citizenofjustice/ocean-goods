import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";

import { CatalogItem } from "../types/CatalogItem";

// Catalog item class implementing CatalogItem interface
class CatalogItemModel implements CatalogItem {
  productId: string = nanoid();
  name: string;
  price: number;
  weight: number;
  kcal: number;
  image?: JSX.Element;

  constructor(
    name: string,
    price: number,
    weight: number,
    kcal: number,
    image?: JSX.Element
  ) {
    makeAutoObservable(this);
    this.name = name;
    this.price = price;
    this.weight = weight;
    this.kcal = kcal;
    this.image = image;
  }
}

export default CatalogItemModel;
