import { makeAutoObservable, action, observable, computed } from "mobx";

import CartItemModel from "@/classes/CartItemModel";
import CatalogItemModel from "@/classes/CatalogItemModel";

// Loading cart items from local storage
const cartItemsFromLStorage: CartItemModel[] = JSON.parse(
  localStorage.getItem("cart") || "[]",
);

// creating store class for keeping cart items
class CartStore {
  // Observable array of cart items
  cartItems: CartItemModel[] = cartItemsFromLStorage;

  // Computed property for the total quantity of items in the cart
  get totalQuantity(): number {
    return this.cartItems.length;
  }

  // Computed property for the total price of items in the cart
  get totalCartPrice(): number {
    const initialValue = 0;
    const summedPrice: number = this.cartItems.reduce(
      (accumulator: number, currentValue: CartItemModel) =>
        accumulator +
        (typeof currentValue.totalProductPrice === "number"
          ? currentValue.totalProductPrice
          : 0),
      initialValue,
    );
    return summedPrice;
  }

  // Constructor for the CartStore class
  constructor() {
    this.cartItems = cartItemsFromLStorage.map(
      (item) =>
        new CartItemModel(
          item.productId,
          item.productName,
          item.productTypeId,
          item.amount,
          item.weight,
          item.price,
          item.discount,
          item.kcal,
          item.mainImage,
        ),
    );

    // Making all properties of this class observable and actions for MobX
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

  // Method to find a cart item by product ID
  findCartItem(productId: number) {
    const cartItem: CartItemModel | undefined = this.cartItems.find(
      (item) => item.productId === productId,
    );
    return cartItem;
  }

  // Action to add an item to the cart
  addItem(product: CatalogItemModel) {
    if (!product.inStock) throw new Error("Not in stock");
    const inCartProduct = this.findCartItem(product.productId);
    if (inCartProduct) {
      inCartProduct.amount++;
    } else {
      try {
        const startAmount = 1;
        const newItem = new CartItemModel(
          product.productId,
          product.productName,
          product.productTypeId,
          startAmount,
          product.weight,
          product.price,
          product.discount,
          product.kcal,
          product.mainImage,
        );
        this.cartItems.push(newItem);
      } catch (error) {
        console.error("Failed to add item to cart: ", error);
      }
    }
  }

  // Action to remove an item from the cart
  removeItem(cartItemId: string) {
    try {
      const filteredItems = this.cartItems.filter(
        (item) => item.cartItemId !== cartItemId,
      );
      this.cartItems = filteredItems;
      return this.cartItems;
    } catch (error) {
      console.error("Failed to remove cart item: ", error);
    }
  }

  // Action to decrease the amount of a cart item
  amountDecrease(inCartProduct: CartItemModel) {
    try {
      if (inCartProduct.amount === 1) {
        this.removeItem(inCartProduct.cartItemId);
      } else {
        if (inCartProduct.amount > 0) inCartProduct.amount--;
      }
      return this.cartItems;
    } catch (error) {
      console.error("Failed to decrease item amount: ", error);
    }
  }

  // Action to clear the cart
  clearCart() {
    try {
      localStorage.setItem("cart", "[]");
      this.cartItems = [];
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }
}

export default new CartStore();
