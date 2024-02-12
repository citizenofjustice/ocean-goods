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
        accumulator +
        (typeof currentValue.totalProductPrice === "number"
          ? currentValue.totalProductPrice
          : 0),
      initialValue
    );
    return summedPrice;
  }

  constructor() {
    this.cartItems = cartItemsFromLStorage.map(
      (item) =>
        new CartItemModel(
          item.productId,
          item.productName,
          item.productTypeId,
          item.weight,
          item.price,
          item.discount,
          item.kcal,
          item.mainImage
        )
    );

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
      const newItem = new CartItemModel(
        product.productId,
        product.productName,
        product.productTypeId,
        product.weight,
        product.price,
        product.discount,
        product.kcal,
        product.mainImage
      );
      this.cartItems.push(newItem);
    }
  }

  removeItem(cartItemId: string) {
    const filteredItems = this.cartItems.filter(
      (item) => item.cartItemId !== cartItemId
    );
    this.cartItems = filteredItems;
    return this.cartItems;
  }

  amountDecrease(inCartProduct: CartItemModel) {
    if (inCartProduct.amount === 1) {
      this.removeItem(inCartProduct.cartItemId);
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
      this.removeItem(item.cartItemId);
    });
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }
}

export default new cartStore();
