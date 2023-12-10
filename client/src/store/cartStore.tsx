import { makeAutoObservable } from "mobx";

import CartItemModel from "../classes/CartItemModel";
import CatalogItemModel from "../classes/CatalogItemModel";

// creating store class for keeping cart items
class cartStore {
  cartItems: CartItemModel[] = [];

  get totalQuantity(): number {
    return this.cartItems.length;
  }

  get totalCartPrice(): number {
    const initialValue = 0;
    const summedPrice: number = this.cartItems.reduce(
      (accumulator: number, currentValue: CartItemModel) =>
        accumulator + currentValue.totalProductPrice,
      initialValue
    );
    return summedPrice;
  }

  constructor() {
    makeAutoObservable(this);
  }

  findCartItem(id: string) {
    const cartItem: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === id
    );
    return cartItem;
  }

  addItem(product: CatalogItemModel) {
    const inCartProduct = this.findCartItem(product.productId);
    if (inCartProduct) {
      inCartProduct.incrementAmount();
    } else {
      this.cartItems?.push(
        new CartItemModel(
          product.productId,
          product.name,
          product.weight,
          product.price,
          product.kcal,
          product.image
        )
      );
    }
  }

  removeItem(productId: string) {
    const inCartProduct = this.findCartItem(productId);
    if (inCartProduct) {
      if (inCartProduct.amount === 1) {
        const filteredItems = this.cartItems.filter(
          (item) => item.productId !== productId
        );
        this.cartItems = filteredItems;
      } else {
        inCartProduct.decrementAmount();
      }
    }
  }
}

export default new cartStore();
