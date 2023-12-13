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

  findCartItem(productId: number) {
    const cartItem: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === productId
    );
    return cartItem;
  }

  addItem(product: CatalogItemModel) {
    const inCartProduct = this.findCartItem(product.id);
    if (inCartProduct) {
      inCartProduct.incrementAmount();
    } else {
      // this.cartItems?.push(
      //   new CartItemModel(
      //     id,
      //     product.id,
      //     product.productName,
      //     product.productTypeId,
      //     product.price,
      //     product.discount,
      //     product.weight,
      //     product.kcal,
      //     product.mainImage
      //   )
      // );
    }
  }

  removeItem(productId: number) {
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
