import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";

import { CartItem } from "../types/CartItem";

// Cart item class implementing CartItem interface
class CartItemModel implements CartItem {
  cartItemId: string = nanoid();
  amount: number = 1;
  productId: string = nanoid();
  name: string;
  price: number;
  weight: number;
  kcal: number;
  image?: JSX.Element;

  // calc cart item total price
  get totalProductPrice(): number {
    const totalProductPrice = this.amount * this.price;
    return totalProductPrice;
  }

  constructor(
    productId: string,
    name: string,
    weight: number,
    price: number,
    kcal: number,
    image?: JSX.Element
  ) {
    makeAutoObservable(this);
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.weight = weight;
    this.kcal = kcal;
    this.image = image;
  }

  // increase cart item amount by 1
  incrementAmount(): void {
    this.amount++;
  }
  // decrease cart item amount by 1
  decrementAmount(): void {
    // decrease only if amount is more than 0
    if (this.amount > 0) this.amount--;
  }
}

export default CartItemModel;
