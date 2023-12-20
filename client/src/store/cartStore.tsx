import { makeAutoObservable } from "mobx";

import CartItemModel from "../classes/CartItemModel";
import CatalogItemModel from "../classes/CatalogItemModel";

const cartItemsFromLStorage: CartItemModel[] = JSON.parse(
  localStorage.getItem("cart") || "[]"
);

// creating store class for keeping cart items
class cartStore {
  cartItems: CartItemModel[] = cartItemsFromLStorage;

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

  findCartItem(productId: number) {
    const cartItem: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === productId
    );
    return cartItem;
  }

  addItem(product: CatalogItemModel) {
    const inCartProduct = this.findCartItem(product.productId);
    if (inCartProduct) {
      inCartProduct.amount++;
    } else {
      this.cartItems.push(
        new CartItemModel(
          product.productId,
          product.productName,
          product.productTypeId,
          product.weight,
          product.price,
          product.discount,
          product.kcal,
          product.mainImage
        )
      );
    }
  }

  removeItem(inCartProduct: CartItemModel) {
    if (inCartProduct.amount === 1) {
      const filteredItems = this.cartItems.filter(
        (item) => item.cartItemId !== inCartProduct.cartItemId
      );
      this.cartItems = filteredItems;
    } else {
      if (inCartProduct.amount > 0) inCartProduct.amount--;
    }
    return this.cartItems;
  }
}

export default new cartStore();
