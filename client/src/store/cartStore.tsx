import { makeAutoObservable } from "mobx";

import CartItemModel from "../classes/CartItemModel";
import { CatalogItem } from "../types/CatalogItem";

// creating store class for keeping cart items
class cartStore {
  cartItems: CartItemModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(product: CatalogItem) {
    const inCartProduct: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === product.productId
    );
    if (inCartProduct) {
      inCartProduct.incrementAmount();
    } else {
      this.cartItems?.push(
        new CartItemModel(
          product.productId,
          product.name,
          product.weigth,
          product.price,
          product.kcal,
          product.image
        )
      );
    }
  }
}

export default new cartStore();
