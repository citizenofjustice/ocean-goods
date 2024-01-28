import { makeAutoObservable, action, observable, computed } from "mobx";

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
    makeAutoObservable(this, {
      cartItems: observable,
      totalQuantity: computed,
      totalCartPrice: computed,
      addItem: action,
      removeItem: action,
      amountDecrease: action,
      clearCart: action,
    });
  }

  findCartItem(productId: number) {
    const cartItem: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === productId
    );
    return cartItem;
  }

  addItem(product: CatalogItemModel) {
    if (!product.inStock) throw new Error("Not in stock");
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

  removeItem(cartItem: CartItemModel) {
    const filteredItems = this.cartItems.filter(
      (item) => item.cartItemId !== cartItem.cartItemId
    );
    this.cartItems = filteredItems;
  }

  amountDecrease(inCartProduct: CartItemModel) {
    if (inCartProduct.amount === 1) {
      this.removeItem(inCartProduct);
    } else {
      if (inCartProduct.amount > 0) inCartProduct.amount--;
    }
    return this.cartItems;
  }

  clearCart() {
    localStorage.setItem("cart", "[]");
    this.cartItems = [];
  }

  compare(catalogItemsProductIds: number[]) {
    if (this.cartItems.length === 0) return;
    const removedFromCatalog = this.cartItems.filter(
      (el) => catalogItemsProductIds.indexOf(el.productId) === -1
    );
    removedFromCatalog.map((item) => {
      this.removeItem(item);
    });
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }
}

export default new cartStore();
