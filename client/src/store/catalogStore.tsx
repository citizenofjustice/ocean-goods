import { makeAutoObservable } from "mobx";
import CatalogItemModel from "../classes/CatalogItemModel";
import tmpImg from "../assets/images/tmp.jpg";

class CatalogStore {
  catalogItems: CatalogItemModel[] = [
    new CatalogItemModel("Горбуша", 200, 320, 80, <img src={tmpImg} />),
    new CatalogItemModel("Тунец", 250, 208, 90, <img src={tmpImg} />),
    new CatalogItemModel("Сайра", 230, 350, 120, <img src={tmpImg} />),
  ];

  get itemCouter(): number {
    return this.catalogItems.length;
  }

  constructor() {
    makeAutoObservable(this);
  }

  addCatalogItem(item: CatalogItemModel) {
    this.catalogItems?.push(
      new CatalogItemModel(
        item.name,
        item.weight,
        item.price,
        item.kcal,
        item.image
      )
    );
  }
}

export default new CatalogStore();
